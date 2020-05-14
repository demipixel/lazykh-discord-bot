import { MessageHandler } from '.';
import axios from 'axios';
import { isInAdminChannel } from '../util/admin.util';
import { respondInvalidFormat } from '../util/command.util';
import { createConfirmationEmbed } from '../embeds/confirmation.embed';
import { Confirmation } from '../confirmation-handler';

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
    return true;
  } else if (!msg.attachments.first()) {
    await msg.channel.send("You didn't attach a script!");
    return true;
  }

  const name = match[1];
  const resp = await axios.get(msg.attachments.first()!.url);

  if (resp.status !== 200) {
    await msg.channel.send('Could not fetch attachment!');
    return true;
  } else if (resp.data.length === 0 || typeof resp.data !== 'string') {
    await msg.channel.send('Empty or invalid attachment!');
    return true;
  }

  const lines = resp.data
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  if (lines.length === 0) {
    await msg.channel.send('There are no valid lines in this script!');
    return true;
  }

  await createConfirmationEmbed(
    msg,
    Confirmation.ADD_VIDEO,
    { title: name, lines },
    {
      title: `Add Video "${name}"?`,
      fields: [
        ['# of Lines', lines.length.toString()],
        ['First Line', lines[0]],
        ['Last Line', lines[lines.length - 1]],
        ['Shortest Line', lines.sort((a, b) => a.length - b.length)[0]],
        ['Longest Line', lines.sort((a, b) => b.length - a.length)[0]],
      ],
    },
  );

  return true;
};
