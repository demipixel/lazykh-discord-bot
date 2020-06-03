import { connection } from '../util/db.util';
import * as Discord from 'discord.js';
import {
  ConfirmationObjTemplate,
  Confirmation,
} from './confirmation-obj.template';
import { EntryRepository } from '../modules/queue/repo/entry.repo';
import { distributeLines } from '../modules/queue/distribute-lines';
import { sendSuccessEmbed } from '../embeds/success.embed';

export interface RejectEntryConfirmation extends ConfirmationObjTemplate {
  type: Confirmation.REJECT_ENTRY;
  entryId: number;
}

export const RejectLineCH = async (
  conf: RejectEntryConfirmation,
  msg: Discord.Message,
) => {
  const entryRepo = connection.getCustomRepository(EntryRepository);

  await entryRepo.rejectEntry(conf.entryId);

  await distributeLines(msg.client);

  await sendSuccessEmbed(msg, {
    title: 'Entry Rejected',
    description:
      'The entry was rejected and the line has gone back into the queue.',
  });
};
