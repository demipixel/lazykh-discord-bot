import { EntityRepository, Repository } from 'typeorm';
import { BaseRepository } from '../../../util/base-repo';
import { ScriptEntity } from '../entities/script.entity';
import { ScriptLineEntity } from '../entities/script-line.entity';
import { ScriptStatus } from '../script-status.enum';
import { EntryStatus } from '../../queue/entry-status.enum';

@EntityRepository(ScriptEntity)
export class ScriptRepository extends BaseRepository<
  ScriptEntity,
  ScriptRepository
> {
  constructor() {
    super(ScriptRepository);
  }

  get scriptLineRepo() {
    return this.manager.getRepository(ScriptLineEntity);
  }

  async add(title: string, lines: string[]) {
    if ((await this.repository.count({ title })) > 0) {
      return 'A video with this title already exists!';
    }

    const script = new ScriptEntity();
    script.title = title;

    const insertResult = await this.repository.insert(script);
    const scriptId = insertResult.identifiers[0].id;

    await Promise.all(
      lines.map(async (text, index) => {
        const line = new ScriptLineEntity();
        line.index = index;
        line.text = text;
        line.script_id = scriptId;

        return this.scriptLineRepo.insert(line);
      }),
    );
  }

  async getByTitle(title: string) {
    return this.repository.findOne({ title });
  }

  async getNumberOfLines(scriptId: number) {
    return this.scriptLineRepo.count({ script_id: scriptId });
  }

  async getAvailableLine() {
    return this.scriptLineRepo
      .createQueryBuilder('line')
      .innerJoin('line.script', 'script')
      .where('script.status = :status', { status: ScriptStatus.ACTIVE })
      .andWhere(
        '(SELECT COUNT(*) FROM entry WHERE line_id = line.id AND (status = :in_progress OR status = :complete)) = 0',
        {
          in_progress: EntryStatus.IN_PROGRESS,
          complete: EntryStatus.COMPLETE,
        },
      )
      .getOne();
  }

  async getAllAvailableLines(limit: number) {
    return this.scriptLineRepo
      .createQueryBuilder('line')
      .innerJoin('line.script', 'script')
      .where('script.status = :status', { status: ScriptStatus.ACTIVE })
      .andWhere(
        '(SELECT COUNT(*) FROM entry WHERE line_id = line.id AND (status = :in_progress OR status = :complete)) = 0',
        {
          in_progress: EntryStatus.IN_PROGRESS,
          complete: EntryStatus.COMPLETE,
        },
      )
      .orderBy('script.released_at', 'ASC')
      .addOrderBy('line.index', 'ASC')
      .limit(limit)
      .getMany();
  }

  async getLineByIndex(script_id: number, index: number) {
    return this.scriptLineRepo.findOne({ script_id, index });
  }

  async releaseScript(scriptId: number) {
    return this.repository.update(
      { id: scriptId },
      { status: ScriptStatus.ACTIVE },
    );
  }
}
