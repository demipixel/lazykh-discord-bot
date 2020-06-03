import { EntityRepository, Repository, In } from 'typeorm';
import { BaseRepository } from '../../../util/base-repo';
import { EntryEntity } from '../entities/entry.entity';
import { EntryStatus } from '../entry-status.enum';
import { ScriptLineEntity } from '../../script/entities/script-line.entity';

@EntityRepository(EntryEntity)
export class EntryRepository extends BaseRepository<
  EntryEntity,
  EntryRepository
> {
  constructor() {
    super(EntryRepository);
  }

  async addUserToQueue(userId: string, availableLineId: number | null) {
    if (await this.getActiveEntryForUser(userId)) {
      return false;
    }

    const entry = new EntryEntity();
    entry.user_id = userId;
    if (availableLineId === null) {
      entry.status = EntryStatus.WAITING;
    } else {
      entry.status = EntryStatus.IN_PROGRESS;
      entry.line_id = availableLineId;
      entry.started_at = new Date();
    }

    const insertResult = await this.repository.insert(entry);
    const entryId: number = insertResult.identifiers[0].id;

    return entryId;
  }

  async giveEntryLine(entry: EntryEntity, line: ScriptLineEntity) {
    await this.update(entry, {
      status: EntryStatus.IN_PROGRESS,
      line_id: line.id,
      started_at: new Date(),
    });
  }

  async finishEntry(entryId: number) {
    await this.repository.update(
      { id: entryId },
      { status: EntryStatus.COMPLETE },
    );
  }

  async rejectEntry(entryId: number) {
    await this.repository.update(
      { id: entryId },
      { status: EntryStatus.REJECTED },
    );
  }

  async getActiveEntryForUser(userId: string) {
    return this.repository.findOne({
      user_id: userId,
      status: In([EntryStatus.WAITING, EntryStatus.IN_PROGRESS]),
    });
  }

  async getQueuePosition(entryId: number) {
    return (
      await this.manager.query(
        `SELECT * FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY joined_at ASC) as position FROM "entry" WHERE status = $1) AS a WHERE a.id = $2`,
        [EntryStatus.WAITING, entryId],
      )
    )[0]?.position;
  }

  async countUsersInQueue() {
    return this.repository.count({ status: EntryStatus.WAITING });
  }

  async getAllWaitingEntriesSorted() {
    return this.repository.find({
      where: { status: EntryStatus.WAITING },
      order: { joined_at: 'ASC' },
    });
  }

  async getCompleteEntryWithLineId(lineId: number) {
    return this.repository.findOne({
      status: EntryStatus.COMPLETE,
      line_id: lineId,
    });
  }
}
