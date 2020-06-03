import { connection } from '../util/db.util';
import * as Discord from 'discord.js';
import {
  ConfirmationObjTemplate,
  Confirmation,
} from './confirmation-obj.template';
import { EntryRepository } from '../modules/queue/repo/entry.repo';
import { EntryStatus } from '../modules/queue/entry-status.enum';
import { distributeLines } from '../modules/queue/distribute-lines';
import { downloadImage } from '../util/download-image.util';
import { sendFailEmbed } from '../embeds/fail.embed';
import { sendSuccessEmbed } from '../embeds/success.embed';

export interface SubmitEntryConfirmation extends ConfirmationObjTemplate {
  type: Confirmation.SUBMIT_ENTRY;
  image: string;
  entryId: number;
}

export const SubmitEntryCH = async (
  conf: SubmitEntryConfirmation,
  msg: Discord.Message,
) => {
  const entryRepo = connection.getCustomRepository(EntryRepository);

  let error: Error | undefined;
  await downloadImage(conf.image, conf.entryId + '.png').catch((err) => {
    error = err;
  });

  if (error) {
    await sendFailEmbed(msg, {
      title: 'Submission Failed',
      description: error.message,
    });
  } else {
    await entryRepo.finishEntry(conf.entryId);
  }

  await sendSuccessEmbed(msg, {
    title: 'Submitted Entry',
    description:
      "Awesome, it's been submitted! We'll see you in the next video :)",
  });
};
