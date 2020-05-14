import * as Config from 'config';
import * as Discord from 'discord.js';
import { handleMessage } from './handle-message';
import { receiveReaction } from './confirmation-handler';

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('message', (msg) => {
  console.log(msg.author.username + ': ' + msg.content);
  if (msg.author.id === client.user?.id) return;

  handleMessage(msg).catch((err) => console.error(err));
});

client.on('messageReactionAdd', (msgReaction) => {
  if (msgReaction.count === 1) {
    return;
  }

  receiveReaction(msgReaction).catch((err) => console.error(err));
});

client.login(Config.get('discord.token')).catch((err) => console.error(err));
