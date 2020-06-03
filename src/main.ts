import * as Config from 'config';
import * as Discord from 'discord.js';
import { handleMessage } from './handle-message';
import { setupTypeorm } from './util/db.util';
import { createQueueEmbedIfNotExists } from './embeds/queue.embed';
import { handleReaction } from './handle-reaction';

// tslint:disable-next-line
require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);

  createQueueEmbedIfNotExists(client).catch((err) => {
    throw err;
  });
});

client.on('message', (msg) => {
  console.log(msg.author.username + ': ' + msg.content);
  if (msg.author.id === client.user?.id) return;

  handleMessage(msg).catch((err) => console.error(err));
});

client.on('messageReactionAdd', (msgReaction, user) => {
  if (user.id === client.user?.id) {
    return;
  }

  handleReaction(msgReaction, user).catch((err) => console.error(err));
});

async function start() {
  await setupTypeorm();
  console.log('Connected to database');
  await client.login(Config.get('discord.token'));
}

start().catch((err) => console.error(err));
