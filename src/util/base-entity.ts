import { PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntityWithId implements EntityInterface {
  @PrimaryGeneratedColumn()
  id: number;

  getCriteria() {
    return { id: this.id };
  }
}

export interface EntityInterface {
  getCriteria: () => object;
}
