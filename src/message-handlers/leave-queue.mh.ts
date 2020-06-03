import * as moment from 'moment';

import { MessageHandler } from '.';
import { isInDM } from '../util/command.util';
import { connection } from '../util/db.util';
import { sendConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { sendFailEmbed } from '../embeds/fail.embed';
import { EntryRepository } from '../modules/queue/repo/entry.repo';

const FAIL_TITLE = 'Failed to Leave Queue';

export const LeaveQueue: MessageHandler = async (msg) => {
  if (msg.content !== '!leave') {
    return false;
  } else if (!isInDM(msg)) {
    return;
  }

  const entryRepo = connection.getCustomRepository(EntryRepository);
  const entry = await entryRepo.getActiveEntryForUser(msg.author.id);

  if (!entry) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'You are not currently in the queue!',
    });
    return;
  }

  await sendConfirmationEmbed(
    msg,
    { type: Confirmation.LEAVE_QUEUE, userId: msg.author.id },
    {
      title: `Are you sure you want to leave the queue?`,
    },
  );

  return;
};
