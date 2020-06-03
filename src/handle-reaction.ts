import * as Discord from 'discord.js';
import { reactionHandlers } from './reaction-handlers';

export const handleReaction = async (
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) => {
  for (const handler of reactionHandlers) {
    const end = await handler(reaction, user);
    if (end !== false) {
      break;
    }
  }
};
