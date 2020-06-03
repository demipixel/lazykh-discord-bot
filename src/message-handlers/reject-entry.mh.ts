import { MessageHandler } from '.';
import { respondInvalidFormat, isInAdminChannel } from '../util/command.util';
import { sendConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { sendFailEmbed } from '../embeds/fail.embed';
import { connection } from '../util/db.util';
import { ScriptRepository } from '../modules/script/repo/script.repo';
import { EntryRepository } from '../modules/queue/repo/entry.repo';

const FAIL_TITLE = 'Failed to Reject Entry';

export const RejectLine: MessageHandler = async (msg) => {
  if (!isInAdminChannel(msg)) {
    return false;
  } else if (!msg.content.startsWith('!reject')) {
    return false;
  }

  const match = msg.content.match(/^!reject (.+) (\d+)/);
  const title = match?.[1] || '';
  const lineNumber = parseInt(match?.[2] || '') - 1;
  if (!match) {
    await respondInvalidFormat(msg, '!reject <script name> <line number>');
    return;
  } else if (isNaN(lineNumber)) {
    await respondInvalidFormat(
      msg,
      '!reject <script name> <line number>',
      'You must provide a valid line number.',
    );
    return;
  }

  const scriptRepo = connection.getCustomRepository(ScriptRepository);
  const script = await scriptRepo.getByTitle(title);

  if (!script) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Could not find script with that title!',
    });
    return;
  }

  const line = await scriptRepo.getLineByIndex(script.id, lineNumber);

  if (!line) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Line does not exist with that name!',
    });
    return;
  }

  const entryRepo = connection.getCustomRepository(EntryRepository);
  const entry = await entryRepo.getCompleteEntryWithLineId(line.id);

  if (!entry) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'No one has sucessfully completed that line yet!',
    });
    return;
  }

  await sendConfirmationEmbed(
    msg,
    { type: Confirmation.REJECT_ENTRY, entryId: entry.id },
    {
      title: 'Reject Line?',
      fields: [['Line', line.text]],
      entryIdImage: entry.id,
    },
  );

  return;
};
