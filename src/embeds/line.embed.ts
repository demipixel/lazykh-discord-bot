import * as Discord from 'discord.js';
import { ScriptLineEntity } from '../modules/script/entities/script-line.entity';
import { connection } from '../util/db.util';
import { ScriptRepository } from '../modules/script/repo/script.repo';

export const sendLineEmbed = async (
  user: Discord.User,
  line: ScriptLineEntity,
) => {
  const scriptRepo = connection.getCustomRepository(ScriptRepository);
  const beforeLine =
    (await scriptRepo.getLineByIndex(line.script_id, line.index - 1))?.text ||
    '_<Video start>_';
  const afterLine =
    (await scriptRepo.getLineByIndex(line.script_id, line.index + 1))?.text ||
    '_<Video end>_';

  const embed = new Discord.MessageEmbed();
  embed
    .setTitle('Time to Draw!')
    .setDescription(
      "It's finally time to draw :D\nYou have 12 hours to draw a picture for the line you're given.\nGood luck!",
    )
    .setColor(0x006eff)
    .addFields(
      {
        name: 'Rules',
        value: `
      1. Make sure it\'s PG-13! Anything too innapropriate (especially any hate speech, racism, sexism, bigotry, etc) will not make it in to the video.
      2. Your image should be exactly 100x100 and in either JPEG/JPG or PNG format.
      3. Feel free to include your name somewhere in the picture, but be reasonable (excessive advertising won't make it in!)
      3. Have fun! And it's okay if you're not good at drawing, but we recommend spending at least 5 or 10 minutes on your picture :)
      `,
      },
      {
        name: 'Your Line',
        value: '**' + line.text + '**',
      },
      {
        name: 'In Context',
        value: beforeLine + '\n**' + line.text + '**\n' + afterLine,
      },
      {
        name: 'How to Submit',
        value:
          'To submit, drag your image into Discord and type in the text **!submit**',
      },
    );

  await user.send(embed);
};
