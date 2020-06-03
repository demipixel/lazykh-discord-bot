import * as Discord from 'discord.js';
import { AddVideo } from './add-video.mh';
import { ReleaseVideo } from './release-video.mh';
import { LeaveQueue } from './leave-queue.mh';
import { SubmitEntry } from './submit-entry.mh';
import { RejectLine } from './reject-entry.mh';

export type MessageHandler = (
  msg: Discord.Message,
) => Promise<boolean | undefined>;

export const messageHandlers: MessageHandler[] = [
  AddVideo,
  ReleaseVideo,
  LeaveQueue,
  SubmitEntry,
  RejectLine,
];
