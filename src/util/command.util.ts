import * as Discord from 'discord.js';

export const respondInvalidFormat = async (
  msg: Discord.Message,
  format: string,
  notes?: string,
) => {
  await msg.channel.send(
    'Command Format\n`' + format + '`' + (notes ? '\n*' + notes + '*' : ''),
  );
};
