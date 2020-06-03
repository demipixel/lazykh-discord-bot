import * as Discord from 'discord.js';
import {
  CONTINUE_EMOJI,
  REJECT_EMOJI,
  addConfirmation,
} from '../reaction-handlers/confirmation.rh';
import { ConfirmationObj } from '../confirmation-handlers/all-confirmations';

interface ConfirmationEmbedOpt {
  title: string;
  description?: string;
  image?: string;
  entryIdImage?: number;
  fields?: [string, string][];
}

export const sendConfirmationEmbed = async (
  sourceMessage: Discord.Message,
  confirmation: ConfirmationObj,
  {
    title,
    description = '',
    image,
    entryIdImage,
    fields = [],
  }: ConfirmationEmbedOpt,
) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle(title)
    .setDescription(description)
    .setColor(0xffcc00)
    .addFields(fields.map((field) => ({ name: field[0], value: field[1] })));

  if (image) {
    embed.setImage(image);
  }

  if (entryIdImage) {
    embed.attachFiles(['./images/' + entryIdImage + '.png']);
    embed.setImage('attachment://' + entryIdImage + '.png');
  }

  const message = await sourceMessage.channel.send(embed);

  await Promise.all([
    message.react(CONTINUE_EMOJI),
    message.react(REJECT_EMOJI),
  ]);

  addConfirmation(message, confirmation);
};
