import { TypeOrmConfig } from '../config/typeorm.config';
import { createConnection } from 'typeorm';
import { Connection } from 'typeorm';

export let connection: Connection;

export async function setupTypeorm() {
  const typeormConfig: any = TypeOrmConfig(false);
  connection = await createConnection(typeormConfig);
}
