import { MessageHandler } from '.';
import Axios from 'axios';
import { respondInvalidFormat, isInAdminChannel } from '../util/command.util';
import { sendConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handlers/confirmation-obj.template';
import { sendFailEmbed } from '../embeds/fail.embed';

const FAIL_TITLE = 'Failed to Add Video';

export const AddVideo: MessageHandler = async (msg) => {
  if (!isInAdminChannel(msg)) {
    return false;
  } else if (!msg.content.startsWith('!add')) {
    return false;
  }

  const match = msg.content.match(/^!add (.+)/);
  if (!match) {
    await respondInvalidFormat(
      msg,
      '!add <script name>',
      "Don't forget to attach the script!",
    );
    return;
  } else if (!msg.attachments.first()) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: "You didn't attach a script!",
    });
    return;
  }

  const title = match[1];
  const resp = await Axios.get(msg.attachments.first()!.url);

  if (resp.status !== 200) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Could not fetch attachment!',
    });
    return;
  } else if (resp.data.length === 0 || typeof resp.data !== 'string') {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'Empty or invalid attachment!',
    });
    return;
  }

  const lines = resp.data
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  if (lines.length === 0) {
    await sendFailEmbed(msg, {
      title: FAIL_TITLE,
      description: 'There are no valid lines in this script!',
    });
    return;
  }

  await sendConfirmationEmbed(
    msg,
    { type: Confirmation.ADD_VIDEO, title, lines },
    {
      title: `Add Video "${title}"?`,
      fields: [
        ['# of Lines', lines.length.toString()],
        ['First Line', lines[0]],
        ['Last Line', lines[lines.length - 1]],
        ['Shortest Line', lines.slice().sort((a, b) => a.length - b.length)[0]],
        ['Longest Line', lines.slice().sort((a, b) => b.length - a.length)[0]],
      ],
    },
  );

  return;
};
