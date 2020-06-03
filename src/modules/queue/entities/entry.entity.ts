import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntityWithId } from '../../../util/base-entity';
import { ScriptLineEntity } from '../../script/entities/script-line.entity';
import { EntryStatus } from '../entry-status.enum';

@Entity('entry')
export class EntryEntity extends BaseEntityWithId {
  @CreateDateColumn()
  joined_at: Date;

  @Column('timestamp', {
    nullable: true,
  })
  started_at: Date;

  @Column('timestamp', {
    nullable: true,
  })
  ended_at: Date;

  @Column('text', {
    nullable: true,
  })
  user_id: string;

  @ManyToOne((type) => ScriptLineEntity)
  @JoinColumn({ name: 'line_id' })
  line?: ScriptLineEntity | null;

  @Column({
    nullable: true,
  })
  @Index()
  line_id: number | null;

  @Column('smallint')
  status: EntryStatus;
}
