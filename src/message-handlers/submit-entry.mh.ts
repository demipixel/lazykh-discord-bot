import * as moment from 'moment';

import { MessageHandler } from '.';
import { isInDM } from '../util/command.util';
import { connection } from '../util/db.util';
import { sendConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { sendFailEmbed } from '../embeds/fail.embed';
import { EntryRepository } from '../modules/queue/repo/entry.repo';
import { EntryStatus } from '../modules/queue/entry-status.enum';

const FAIL_TITLE = 'Failed to Submit';

export const SubmitEntry: MessageHandler = async (msg) => {
  if (msg.content !== '!submit') {
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
  } else if (entry.status !== EntryStatus.IN_PROGRESS) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: "It's not time to submit an image yet!",
    });
    return;
  } else if (!msg.attachments.first()) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description:
        'You need to drag in an image and then type `!submit` for the message!',
    });
    return;
  }

  await sendConfirmationEmbed(
    msg,
    {
      type: Confirmation.SUBMIT_ENTRY,
      entryId: entry.id,
      image: msg.attachments.first()!.url,
    },
    {
      title: `Are you sure you want to submit this image?`,
      image: msg.attachments.first()!.url,
    },
  );

  return;
};
