import * as Discord from 'discord.js';
import * as Config from 'config';

export const isInAdminChannel = (msg: Discord.Message) => {
  return msg.channel.id === Config.get('admin.channel');
};
