import { AddVideoConfirmation } from './add-video.ch';
import { ReleaseVideoConfirmation } from './release-video.ch';
import { LeaveQueueConfirmation } from './leave-queue.ch';
import { SubmitEntryConfirmation } from './submit-entry.ch';
import { RejectEntryConfirmation } from './reject-entry.ch';

export type ConfirmationObj =
  | AddVideoConfirmation
  | ReleaseVideoConfirmation
  | LeaveQueueConfirmation
  | SubmitEntryConfirmation
  | RejectEntryConfirmation;
