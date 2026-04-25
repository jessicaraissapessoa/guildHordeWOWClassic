import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  createGuild,
  addGuildMember,
  deleteOwnGuild,
  failIfStatusIsNot,
  randomLetters
} from './helpers.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500']
  }
};

export function setup() {
  const leader = buildUser({ username: `delete.leader.${Date.now()}` });
  const member = buildUser({ username: `delete.member.${Date.now()}` });

  failIfStatusIsNot(registerUser(leader), 201, 'setup leader do CPT-006');
  failIfStatusIsNot(registerUser(member), 201, 'setup member do CPT-006');

  const loginResponse = loginUser(leader.username, leader.password);
  failIfStatusIsNot(loginResponse, 200, 'login do CPT-006');
  const token = loginResponse.json('accessToken');

  failIfStatusIsNot(createGuild(token, `Guilda Delete ${randomLetters(6)}`), 201, 'guilda do CPT-006');
  failIfStatusIsNot(addGuildMember(token, member.characterName), 201, 'integrante do CPT-006');

  return {
    accessToken: token
  };
}

export default function (data) {
  const response = deleteOwnGuild(data.accessToken);

  check(response, {
    'CPT-006 retorna 204 na deleção da guilda': (res) => res.status === 204
  });

  sleep(1);
}
