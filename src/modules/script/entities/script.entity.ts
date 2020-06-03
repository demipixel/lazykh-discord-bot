import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScriptStatus } from '../script-status.enum';
import { BaseEntityWithId } from '../../../util/base-entity';

@Entity('script')
export class ScriptEntity extends BaseEntityWithId {
  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', {
    nullable: true,
  })
  released_at: Date;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('smallint', {
    default: ScriptStatus.WAITING,
  })
  status: ScriptStatus;
}
