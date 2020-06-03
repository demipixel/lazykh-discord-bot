import * as Discord from 'discord.js';
import { connection } from '../../util/db.util';
import { EntryRepository } from './repo/entry.repo';
import { ScriptRepository } from '../script/repo/script.repo';
import { ScriptLineEntity } from '../script/entities/script-line.entity';
import { sendLineEmbed } from '../../embeds/line.embed';

export async function distributeLines(client: Discord.Client) {
  const repo = connection.getCustomRepository(EntryRepository);

  const usersWithLines: [string, ScriptLineEntity][] = [];

  await repo.transaction(async (entryRepo, { manager }) => {
    const scriptRepo = manager.getCustomRepository(ScriptRepository);

    const countUsersInQueue = await entryRepo.countUsersInQueue();
    const availableLines = await scriptRepo.getAllAvailableLines(
      countUsersInQueue,
    );
    const entriesInQueueSorted = await entryRepo.getAllWaitingEntriesSorted();

    for (
      let i = 0;
      i < Math.min(availableLines.length, entriesInQueueSorted.length);
      i++
    ) {
      const entry = entriesInQueueSorted[i];
      const line = availableLines[i];

      await entryRepo.giveEntryLine(entry, line);
      usersWithLines.push([entry.user_id, line]);
    }
  });

  const promises: Promise<unknown>[] = [];
  for (const [userId, line] of usersWithLines) {
    const user = await client.users.fetch(userId);
    promises.push(sendLineEmbed(user, line));
  }

  await Promise.all(promises);
}
