const RACES = {
  orc: 'Orc',
  tauren: 'Tauren',
  troll: 'Troll',
  mortovivo: 'Morto-vivo',
  undead: 'Morto-vivo'
};

const CLASSES = {
  guerreiro: 'Guerreiro',
  cacador: 'Cacador',
  ladino: 'Ladino',
  xama: 'Xama',
  bruxo: 'Bruxo',
  druida: 'Druida',
  sacerdote: 'Sacerdote',
  mago: 'Mago'
};

const ROLE_TYPES = {
  tank: 'Tank',
  healer: 'Healer',
  dps: 'DPS'
};

const GUILD_RANKS = {
  leader: 'Leader',
  lider: 'Leader',
  officer: 'Officer',
  oficial: 'Officer',
  member: 'Member',
  membro: 'Member'
};

const CLASS_ROLE_MATRIX = {
  Orc: {
    Guerreiro: ['Tank', 'DPS'],
    Cacador: ['DPS'],
    Ladino: ['DPS'],
    Xama: ['Healer', 'DPS'],
    Bruxo: ['DPS']
  },
  Tauren: {
    Guerreiro: ['Tank', 'DPS'],
    Cacador: ['DPS'],
    Xama: ['Healer', 'DPS'],
    Druida: ['Tank', 'Healer', 'DPS']
  },
  Troll: {
    Guerreiro: ['Tank', 'DPS'],
    Cacador: ['DPS'],
    Ladino: ['DPS'],
    Sacerdote: ['Healer', 'DPS'],
    Xama: ['Healer', 'DPS'],
    Mago: ['DPS']
  },
  'Morto-vivo': {
    Guerreiro: ['Tank', 'DPS'],
    Ladino: ['DPS'],
    Sacerdote: ['Healer', 'DPS'],
    Mago: ['DPS'],
    Bruxo: ['DPS']
  }
};

const RANK_HIERARCHY = {
  Leader: 3,
  Officer: 2,
  Member: 1
};

module.exports = {
  RACES,
  CLASSES,
  ROLE_TYPES,
  GUILD_RANKS,
  CLASS_ROLE_MATRIX,
  RANK_HIERARCHY
};
