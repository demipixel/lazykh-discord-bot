import { connection } from '../util/db.util';
import * as Discord from 'discord.js';
import { ScriptRepository } from '../modules/script/repo/script.repo';
import {
  ConfirmationObjTemplate,
  Confirmation,
} from './confirmation-obj.template';
import { distributeLines } from '../modules/queue/distribute-lines';

export interface ReleaseVideoConfirmation extends ConfirmationObjTemplate {
  type: Confirmation.RELEASE_VIDEO;
  title: string;
  id: number;
}

export const ReleaseVideoCH = async (
  conf: ReleaseVideoConfirmation,
  channel: Discord.Channel,
) => {
  const scriptRepo = connection.getCustomRepository(ScriptRepository);

  await scriptRepo.releaseScript(conf.id);

  await distributeLines(channel.client);
};
