import * as Discord from 'discord.js';

export const CONTINUE_EMOJI = '✅';
export const REJECT_EMOJI = '🚫';

export enum Confirmation {
  ADD_VIDEO = 0,
}

interface ConfirmationObj {
  message: Discord.Message;
  type: Confirmation;
  data: any;
}

const waitingConfirmations: { [messageId: string]: ConfirmationObj } = {};

export const addConfirmation = (
  msg: Discord.Message,
  type: Confirmation,
  data: any,
) => {
  console.log(`Waiting for confirmation ${type} on ${msg.id}`, data);
  waitingConfirmations[msg.id] = {
    message: msg,
    type,
    data,
  };
};

export const receiveReaction = async (reaction: Discord.MessageReaction) => {
  if (!waitingConfirmations[reaction.message.id]) {
    return;
  } else if (
    reaction.emoji.name !== CONTINUE_EMOJI &&
    reaction.emoji.name !== REJECT_EMOJI
  ) {
    return;
  }

  const confirmation = waitingConfirmations[reaction.message.id];

  if (reaction.emoji.name === CONTINUE_EMOJI) {
    if (reaction.message.deleted) {
      return;
    }
  } else {
    delete waitingConfirmations[reaction.message.id];
    await confirmation.message.delete();
  }
};
