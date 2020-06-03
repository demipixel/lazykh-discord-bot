import * as Config from 'config';
import * as Discord from 'discord.js';

import { ReactionHandler } from '.';
import { JOIN_QUEUE_EMOJI } from '../embeds/queue.embed';
import { connection } from '../util/db.util';
import { EntryRepository } from '../modules/queue/repo/entry.repo';
import { ScriptRepository } from '../modules/script/repo/script.repo';
import { sendSuccessEmbed } from '../embeds/success.embed';
import { sendFailEmbed } from '../embeds/fail.embed';
import { sendLineEmbed } from '../embeds/line.embed';

export const JoinQueue: ReactionHandler = async (reaction, user) => {
  if (reaction.message.channel.id !== Config.get('queue.channel')) {
    return false;
  } else if (reaction.emoji.name !== JOIN_QUEUE_EMOJI) {
    return false;
  }

  if (user.partial) {
    user = await user.fetch();
  }

  await reaction.users.remove(user);

  const scriptRepo = connection.getCustomRepository(ScriptRepository);
  const availableLine = await scriptRepo.getAvailableLine();

  const entryRepo = connection.getCustomRepository(EntryRepository);

  const newEntryId = await entryRepo.addUserToQueue(
    user.id,
    availableLine?.id || null,
  );

  if (!newEntryId) {
    await sendFailEmbed(user, {
      title: 'You are already in the queue',
      description: 'If you want to leave, use !leave',
    });
  } else if (!availableLine) {
    const position = await entryRepo.getQueuePosition(newEntryId);
    await sendSuccessEmbed(user, {
      title: 'You joined the queue!',
      description:
        `**You are position ${position} in the queue.**\n` +
        "You'll get a message from me when it's time for you to draw and you'll get 12 hours to draw it.\n\n" +
        '(DM me `!position` to check your position in the queue again)',
    });
  } else {
    await sendLineEmbed(user, availableLine);
  }
};
