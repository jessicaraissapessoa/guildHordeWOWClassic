CREATE DATABASE IF NOT EXISTS guild_horde_wow_classic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE guild_horde_wow_classic;

CREATE TABLE IF NOT EXISTS guilds (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  guild_name VARCHAR(24) NOT NULL,
  guild_name_normalized VARCHAR(24) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_guilds_guild_name_normalized (guild_name_normalized)
);

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(30) NOT NULL,
  username_normalized VARCHAR(30) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  character_name VARCHAR(12) NOT NULL,
  character_name_normalized VARCHAR(12) NOT NULL,
  race VARCHAR(20) NOT NULL,
  class VARCHAR(20) NOT NULL,
  role_type VARCHAR(20) NOT NULL,
  guild_id BIGINT UNSIGNED NULL,
  guild_rank VARCHAR(20) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username_normalized (username_normalized),
  UNIQUE KEY uq_users_character_name_normalized (character_name_normalized),
  KEY idx_users_guild_id (guild_id),
  CONSTRAINT fk_users_guild_id
    FOREIGN KEY (guild_id)
    REFERENCES guilds (id)
    ON DELETE SET NULL
);
