import * as Discord from 'discord.js';
import * as Config from 'config';

export const respondInvalidFormat = async (
  msg: Discord.Message,
  format: string,
  notes?: string,
) => {
  await msg.channel.send(
    'Command Format\n`' + format + '`' + (notes ? '\n*' + notes + '*' : ''),
  );
};

export const isInAdminChannel = (msg: Discord.Message) => {
  return msg.channel.id === Config.get('admin.channel');
};

export const isInDM = (msg: Discord.Message) => {
  return msg.channel.type === 'dm';
};
