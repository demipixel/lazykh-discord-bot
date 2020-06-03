import * as Discord from 'discord.js';
import * as Config from 'config';

import { ConfirmationObj } from '../confirmation-handlers/all-confirmations';

export const JOIN_QUEUE_EMOJI = '✏️';

export let queueMessage: Discord.Message;

export const createQueueEmbedIfNotExists = async (client: Discord.Client) => {
  const channel = client.channels.resolve(Config.get('queue.channel'));

  if (!channel) {
    throw new Error(
      'Cannot find queue channel ' + Config.get('queue.channel') + '!',
    );
  } else if (!(channel instanceof Discord.TextChannel)) {
    throw new Error('Queue channel is not a text channel!');
  }

  await channel.bulkDelete(100);

  const embed = new Discord.MessageEmbed();
  embed
    .setTitle('LazyKH')
    .setDescription(
      'Welcome to the LazyKH Discord Server! Join the queue by reacting below and...',
    )
    .setColor(0x006eff);

  const message = await channel.send(embed);

  await message.react(JOIN_QUEUE_EMOJI);
};
