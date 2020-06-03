import * as moment from 'moment';

import { MessageHandler } from '.';
import { respondInvalidFormat, isInAdminChannel } from '../util/command.util';
import { connection } from '../util/db.util';
import { ScriptRepository } from '../modules/script/repo/script.repo';
import { sendConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { sendFailEmbed } from '../embeds/fail.embed';

const FAIL_TITLE = 'Failed to Release Video';

export const ReleaseVideo: MessageHandler = async (msg) => {
  if (!isInAdminChannel(msg)) {
    return false;
  } else if (!msg.content.startsWith('!release')) {
    return false;
  }

  const match = msg.content.match(/^!release (.+)/);
  if (!match) {
    await respondInvalidFormat(msg, '!release <script name>');
    return;
  }

  const scriptRepo = connection.getCustomRepository(ScriptRepository);
  const script = await scriptRepo.getByTitle(match[1]);

  if (!script) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Cannot find a video with that title!',
    });
    return;
  }

  await sendConfirmationEmbed(
    msg,
    { type: Confirmation.RELEASE_VIDEO, title: match[1], id: script.id },
    {
      title: `Release Video "${script.title}"?`,
      fields: [
        ['Created', moment(script.created_at).fromNow()],
        [
          '# of Lines',
          (await scriptRepo.getNumberOfLines(script.id)).toString(),
        ],
      ],
    },
  );

  return;
};
