import * as Discord from 'discord.js';
import { AddVideo } from './admin.mh';

export type MessageHandler = (msg: Discord.Message) => Promise<boolean>;

export const messageHandlers: MessageHandler[] = [AddVideo];
