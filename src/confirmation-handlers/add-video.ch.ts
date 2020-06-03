import { connection } from '../util/db.util';
import * as Discord from 'discord.js';
import { ScriptRepository } from '../modules/script/repo/script.repo';
import {
  ConfirmationObjTemplate,
  Confirmation,
} from './confirmation-obj.template';

export interface AddVideoConfirmation extends ConfirmationObjTemplate {
  type: Confirmation.ADD_VIDEO;
  title: string;
  lines: string[];
}

export const AddVideoCH = async (
  conf: AddVideoConfirmation,
  channel: Discord.Channel,
) => {
  const scriptRepo = connection.getCustomRepository(ScriptRepository);

  const error = await scriptRepo.add(conf.title, conf.lines);

  if (error && channel instanceof Discord.TextChannel) {
    await channel.send(error);
  }
};
