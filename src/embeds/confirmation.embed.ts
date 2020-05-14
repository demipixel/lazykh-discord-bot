import * as Discord from 'discord.js';
import {
  CONTINUE_EMOJI,
  REJECT_EMOJI,
  Confirmation,
  addConfirmation,
} from '../confirmation-handler';

interface ConfirmationEmbedOpt {
  title: string;
  description?: string;
  fields?: [string, string][];
}

export const createConfirmationEmbed = async (
  sourceMessage: Discord.Message,
  type: Confirmation,
  data: any,
  { title, description = '', fields = [] }: ConfirmationEmbedOpt,
) => {
  const embed = new Discord.MessageEmbed();
  embed
    .setTitle(title)
    .setDescription(description)
    .setColor(0xffcc00)
    .addFields(fields.map((field) => ({ name: field[0], value: field[1] })));

  const message = await sourceMessage.channel.send(embed);

  await Promise.all([
    message.react(CONTINUE_EMOJI),
    message.react(REJECT_EMOJI),
  ]);

  addConfirmation(message, type, data);
};
