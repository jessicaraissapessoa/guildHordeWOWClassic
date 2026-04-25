import exec from 'k6/execution';
import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  createGuild,
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
  const users = [];

  for (let index = 0; index < 3; index += 1) {
    const user = buildUser({ username: `guild.${Date.now()}.${index}` });
    failIfStatusIsNot(registerUser(user), 201, `setup user ${index} do CPT-003`);
    const loginResponse = loginUser(user.username, user.password);
    failIfStatusIsNot(loginResponse, 200, `login user ${index} do CPT-003`);
    users.push({
      accessToken: loginResponse.json('accessToken')
    });
  }

  return { users };
}

export default function (data) {
  const index = exec.scenario.iterationInTest % data.users.length;
  const response = createGuild(
    data.users[index].accessToken,
    `Perf Guild ${randomLetters(5)}`
  );

  check(response, {
    'CPT-003 retorna 201 na criação da guilda': (res) => res.status === 201
  });

  sleep(1);
}
