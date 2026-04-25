const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const scripts = [
  'cpt-001-login.js',
  'cpt-002-listar-usuarios.js',
  'cpt-003-criar-guilda.js',
  'cpt-004-cadastrar-integrante.js',
  'cpt-005-alterar-cargo.js',
  'cpt-006-deletar-guilda.js'
];

const performancePort = process.env.PERFORMANCE_PORT || '3010';
const customBaseUrl = process.env.BASE_URL;
const baseUrl = customBaseUrl || `http://localhost:${performancePort}`;
const k6ResultsDir = process.env.K6_RESULTS_DIR;

function waitForHealth(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function tryRequest() {
      const request = http.get(`${url}/health`, (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
          return;
        }

        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error('Timeout aguardando a API de performance ficar disponível.'));
          return;
        }

        setTimeout(tryRequest, 500);
      });

      request.on('error', () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error('Timeout aguardando a API de performance ficar disponível.'));
          return;
        }

        setTimeout(tryRequest, 500);
      });
    }

    tryRequest();
  });
}

async function run() {
  let serverProcess = null;

  try {
    if (k6ResultsDir) {
      fs.mkdirSync(k6ResultsDir, { recursive: true });
    }

    if (!customBaseUrl) {
      const serverPath = path.join(__dirname, '..', '..', 'src', 'server.js');
      serverProcess = spawn(process.execPath, [serverPath], {
        cwd: path.join(__dirname, '..', '..'),
        stdio: 'inherit',
        env: {
          ...process.env,
          PORT: performancePort,
          DISABLE_RATE_LIMIT: 'true'
        }
      });
    }

    await waitForHealth(baseUrl);

    for (const script of scripts) {
      const scriptPath = path.join(__dirname, script);
      const args = ['run'];

      if (k6ResultsDir) {
        const summaryFileName = `${path.basename(script, '.js')}-summary.json`;
        args.push('--summary-export', path.join(k6ResultsDir, summaryFileName));
      }

      args.push(scriptPath);

      const result = spawnSync('k6', args, {
        stdio: 'inherit',
        env: {
          ...process.env,
          BASE_URL: baseUrl
        }
      });

      if (result.status !== 0) {
        process.exitCode = result.status || 1;
        break;
      }
    }
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
