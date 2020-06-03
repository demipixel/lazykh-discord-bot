import * as Discord from 'discord.js';
import { ConfirmAction } from './confirmation.rh';
import { JoinQueue } from './join-queue.rh';

export type ReactionHandler = (
  reaction: Discord.MessageReaction,
  user: Discord.User | Discord.PartialUser,
) => Promise<boolean | undefined>;

export const reactionHandlers: ReactionHandler[] = [ConfirmAction, JoinQueue];
