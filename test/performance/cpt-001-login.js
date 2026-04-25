import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  failIfStatusIsNot
} from './helpers.js';

export const options = {
  vus: 2,
  iterations: 6,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000']
  }
};

export function setup() {
  const user = buildUser({ username: `login.${Date.now()}` });
  const registerResponse = registerUser(user);
  failIfStatusIsNot(registerResponse, 201, 'setup do CPT-001');

  return user;
}

export default function (user) {
  const response = loginUser(user.username, user.password);

  check(response, {
    'CPT-001 retorna 200 no login': (res) => res.status === 200,
    'CPT-001 devolve accessToken': (res) => Boolean(res.json('accessToken'))
  });

  sleep(1);
}
