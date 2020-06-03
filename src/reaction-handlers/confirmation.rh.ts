import * as Discord from 'discord.js';
import { ConfirmationObj } from '../confirmation-handlers/all-confirmations';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { AddVideoCH } from '../confirmation-handlers/add-video.ch';
import { sendSuccessEmbed } from '../embeds/success.embed';
import { ReactionHandler } from '.';
import { ReleaseVideoCH } from '../confirmation-handlers/release-video.ch';
import { LeaveQueueCH } from '../confirmation-handlers/leave-queue.ch';
import { SubmitEntryCH } from '../confirmation-handlers/submit-entry.ch';
import { RejectLineCH } from '../confirmation-handlers/reject-entry.ch';

export const CONTINUE_EMOJI = '✅';
export const REJECT_EMOJI = '🚫';

interface ConfirmationWrapper {
  confirmation: ConfirmationObj;
  message: Discord.Message;
}

const waitingConfirmations: { [messageId: string]: ConfirmationWrapper } = {};

export const addConfirmation = (
  message: Discord.Message,
  confirmation: ConfirmationObj,
) => {
  waitingConfirmations[message.id] = { message, confirmation };
};

export const ConfirmAction: ReactionHandler = async (reaction) => {
  if (!waitingConfirmations[reaction.message.id]) {
    return false;
  } else if (
    reaction.emoji.name !== CONTINUE_EMOJI &&
    reaction.emoji.name !== REJECT_EMOJI
  ) {
    return false;
  }

  const c = waitingConfirmations[reaction.message.id];

  if (reaction.emoji.name === CONTINUE_EMOJI) {
    if (reaction.message.deleted) {
      return;
    }

    await c.message.delete();

    switch (c.confirmation.type) {
      case Confirmation.ADD_VIDEO:
        await AddVideoCH(c.confirmation, reaction.message.channel);
        await sendSuccessEmbed(reaction.message, {
          title: `Added Video "${c.confirmation.title}"`,
          description:
            'To release the video, use:\n!release ' + c.confirmation.title,
        });
        break;
      case Confirmation.RELEASE_VIDEO:
        await ReleaseVideoCH(c.confirmation, reaction.message.channel);
        await sendSuccessEmbed(reaction.message, {
          title: `Released Video "${c.confirmation.title}"`,
        });
        break;
      case Confirmation.LEAVE_QUEUE:
        await LeaveQueueCH(c.confirmation, reaction.message.channel);
        await sendSuccessEmbed(reaction.message, {
          title: 'Successfully Left Queue',
        });
        break;
      case Confirmation.SUBMIT_ENTRY:
        await SubmitEntryCH(c.confirmation, reaction.message);
        break;
      case Confirmation.REJECT_ENTRY:
        await RejectLineCH(c.confirmation, reaction.message);
        break;
    }
  } else {
    delete waitingConfirmations[reaction.message.id];
    await c.message.delete();
  }
};
