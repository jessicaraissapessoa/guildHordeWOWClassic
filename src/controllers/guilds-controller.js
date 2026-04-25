const guildService = require('../services/guild-service');

async function listGuilds(req, res) {
  const result = await guildService.listGuilds(req.query);
  return res.status(200).json(result);
}

async function createGuild(req, res) {
  const guild = await guildService.createGuild(req.auth.userId, req.body);
  return res.status(201).json(guild);
}

async function deleteOwnGuild(req, res) {
  await guildService.deleteOwnGuild(req.auth.userId);
  return res.status(204).send();
}

async function listGuildMembers(req, res) {
  const result = await guildService.listGuildMembers(req.params.guildName);
  return res.status(200).json(result);
}

async function addGuildMember(req, res) {
  const user = await guildService.addGuildMember(req.auth.userId, req.body);
  return res.status(201).json(user);
}

async function updateGuildMemberRank(req, res) {
  const user = await guildService.updateGuildMemberRank(
    req.auth.userId,
    req.params.characterName,
    req.body
  );
  return res.status(200).json(user);
}

async function removeGuildMember(req, res) {
  await guildService.removeGuildMember(req.auth.userId, req.params.characterName);
  return res.status(204).send();
}

async function leaveOwnGuild(req, res) {
  await guildService.leaveOwnGuild(req.auth.userId);
  return res.status(204).send();
}

module.exports = {
  listGuilds,
  createGuild,
  deleteOwnGuild,
  listGuildMembers,
  addGuildMember,
  updateGuildMemberRank,
  removeGuildMember,
  leaveOwnGuild
};
