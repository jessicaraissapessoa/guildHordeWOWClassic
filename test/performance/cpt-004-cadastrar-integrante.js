import exec from 'k6/execution';
import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  createGuild,
  addGuildMember,
  failIfStatusIsNot,
  randomLetters
} from './helpers.js';

export const options = {
  vus: 1,
  iterations: 3,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500']
  }
};

export function setup() {
  const leader = buildUser({ username: `member.leader.${Date.now()}` });
  failIfStatusIsNot(registerUser(leader), 201, 'setup leader do CPT-004');
  const loginResponse = loginUser(leader.username, leader.password);
  failIfStatusIsNot(loginResponse, 200, 'login leader do CPT-004');
  const token = loginResponse.json('accessToken');
  failIfStatusIsNot(createGuild(token, `Guilda Perf ${randomLetters(6)}`), 201, 'guilda do CPT-004');

  const targets = [];
  for (let index = 0; index < 3; index += 1) {
    const target = buildUser({ username: `member.target.${Date.now()}.${index}` });
    failIfStatusIsNot(registerUser(target), 201, `setup target ${index} do CPT-004`);
    targets.push(target.characterName);
  }

  return {
    accessToken: token,
    targets
  };
}

export default function (data) {
  const index = exec.scenario.iterationInTest % data.targets.length;
  const response = addGuildMember(data.accessToken, data.targets[index]);

  check(response, {
    'CPT-004 retorna 201 no cadastro de integrante': (res) => res.status === 201
  });

  sleep(1);
}
