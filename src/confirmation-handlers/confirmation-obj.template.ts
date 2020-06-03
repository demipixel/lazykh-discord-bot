import * as Discord from 'discord.js';

export enum Confirmation {
  ADD_VIDEO = 0,
  RELEASE_VIDEO = 1,
  LEAVE_QUEUE = 2,
  SUBMIT_ENTRY = 3,
  REJECT_ENTRY = 4,
}

export interface ConfirmationObjTemplate {
  type: Confirmation;
}
