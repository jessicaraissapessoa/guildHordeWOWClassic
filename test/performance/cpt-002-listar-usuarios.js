import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  getUsers,
  failIfStatusIsNot
} from './helpers.js';

export const options = {
  vus: 2,
  iterations: 4,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000']
  }
};

export function setup() {
  const auditor = buildUser({ username: `users.${Date.now()}` });
  const userA = buildUser({ class: 'Xamã', roleType: 'DPS' });
  const userB = buildUser({ race: 'Troll', class: 'Sacerdote', roleType: 'Healer' });

  failIfStatusIsNot(registerUser(auditor), 201, 'setup auditor do CPT-002');
  failIfStatusIsNot(registerUser(userA), 201, 'setup userA do CPT-002');
  failIfStatusIsNot(registerUser(userB), 201, 'setup userB do CPT-002');

  const loginResponse = loginUser(auditor.username, auditor.password);
  failIfStatusIsNot(loginResponse, 200, 'login do CPT-002');

  return {
    accessToken: loginResponse.json('accessToken')
  };
}

export default function (data) {
  const response = getUsers(
    data.accessToken,
    '?class=xama&roleType=dps&page=1&pageSize=10&sortBy=username&sortOrder=asc'
  );

  check(response, {
    'CPT-002 retorna 200 na listagem': (res) => res.status === 200,
    'CPT-002 devolve items': (res) => Array.isArray(res.json('items'))
  });

  sleep(1);
}
