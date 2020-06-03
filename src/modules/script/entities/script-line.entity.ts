import {
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { BaseEntityWithId } from '../../../util/base-entity';
import { ScriptEntity } from './script.entity';

@Entity('script_line')
@Index(['index', 'script_id'], {
  unique: true,
})
export class ScriptLineEntity extends BaseEntityWithId {
  @Column('int')
  index: number;

  @ManyToOne((type) => ScriptEntity)
  @JoinColumn({ name: 'script_id' })
  script?: ScriptEntity;

  @Column()
  @Index()
  script_id: number;

  @Column('text')
  text: string;

  getCriteria() {
    return { id: this.id };
  }
}
