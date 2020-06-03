import { connection } from '../util/db.util';
import * as Discord from 'discord.js';
import {
  ConfirmationObjTemplate,
  Confirmation,
} from './confirmation-obj.template';
import { EntryRepository } from '../modules/queue/repo/entry.repo';
import { EntryStatus } from '../modules/queue/entry-status.enum';
import { distributeLines } from '../modules/queue/distribute-lines';

export interface LeaveQueueConfirmation extends ConfirmationObjTemplate {
  type: Confirmation.LEAVE_QUEUE;
  userId: string;
}

export const LeaveQueueCH = async (
  conf: LeaveQueueConfirmation,
  channel: Discord.Channel,
) => {
  const repo = connection.getCustomRepository(EntryRepository);

  await repo.transaction(async (entryRepo) => {
    const entry = await entryRepo.getActiveEntryForUser(conf.userId);
    if (!entry) {
      return;
    }

    await entryRepo.update(entry, { status: EntryStatus.CANCELED });

    await distributeLines(channel.client);
  });
};
