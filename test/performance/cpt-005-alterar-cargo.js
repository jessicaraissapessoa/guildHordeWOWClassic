import { check, sleep } from 'k6';
import {
  buildUser,
  registerUser,
  loginUser,
  createGuild,
  addGuildMember,
  updateGuildRank,
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
  const leader = buildUser({ username: `rank.leader.${Date.now()}` });
  const target = buildUser({ username: `rank.target.${Date.now()}` });

  failIfStatusIsNot(registerUser(leader), 201, 'setup leader do CPT-005');
  failIfStatusIsNot(registerUser(target), 201, 'setup target do CPT-005');

  const loginResponse = loginUser(leader.username, leader.password);
  failIfStatusIsNot(loginResponse, 200, 'login do CPT-005');
  const token = loginResponse.json('accessToken');

  failIfStatusIsNot(createGuild(token, `Guilda Rank ${randomLetters(6)}`), 201, 'guilda do CPT-005');
  failIfStatusIsNot(addGuildMember(token, target.characterName), 201, 'integrante do CPT-005');

  return {
    accessToken: token,
    characterName: target.characterName
  };
}

export default function (data) {
  const response = updateGuildRank(data.accessToken, data.characterName, 'Oficial');

  check(response, {
    'CPT-005 retorna 200 na alteração de cargo': (res) => res.status === 200
  });

  sleep(1);
}
