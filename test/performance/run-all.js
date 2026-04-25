const { spawn, spawnSync } = require('child_process');
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
      const result = spawnSync('k6', ['run', scriptPath], {
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
