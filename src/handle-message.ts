import * as Discord from 'discord.js';
import { messageHandlers } from './message-handlers';

export const handleMessage = async (msg: Discord.Message) => {
  for (const handler of messageHandlers) {
    const end = await handler(msg);
    if (end !== false) {
      break;
    }
  }
};
