import {
  AbstractRepository,
  DeepPartial,
  EntityManager,
  ObjectType,
} from 'typeorm';

import { EntityInterface } from './base-entity';
import { Newable } from './types.util';

export type OnSuccess = (cb: () => Promise<void>) => void;

export interface Transaction {
  onSuccess: OnSuccess;
  manager: EntityManager;
  transaction: Transaction;
}

export class BaseRepository<
  T extends EntityInterface,
  U
> extends AbstractRepository<T> {
  constructor(private thisClass: ObjectType<U>) {
    super();
  }

  async transaction<R>(
    cb: (thisRepo: U, transaction: Transaction) => Promise<R>,
  ): Promise<R> {
    let ret: R;
    let successCbs: (() => Promise<void>)[] = [];
    const onSuccess = (successCb: () => Promise<void>) => {
      successCbs.push(successCb);
    };
    // 3 attempts
    for (let i = 0; i < 3; i++) {
      successCbs = [];
      try {
        await this.manager.transaction('SERIALIZABLE', async (manager) => {
          const thisRepo = manager.getCustomRepository(this.thisClass);
          // @ts-ignore
          const transaction: Transaction = { onSuccess, manager };
          transaction.transaction = transaction;
          ret = await cb(thisRepo, transaction);
        });
        break;
      } catch (e) {
        if (i === 2) {
          throw e;
        }
      }
    }
    for (const successCb of successCbs) {
      successCb().catch((err) => console.error(err));
    }
    return ret!;
  }

  async update(ent: T, partialEntity: DeepPartial<T>) {
    this.repository.merge(ent, partialEntity);
    await this.repository.update(ent.getCriteria(), partialEntity);
  }

  async updateEntity<Q extends EntityInterface>(
    type: Newable<Q>,
    ent: Q,
    partialEntity: DeepPartial<Q>,
  ) {
    this.manager.merge(type, ent, partialEntity);
    await this.manager.update(type, ent.getCriteria(), partialEntity);
  }
}
