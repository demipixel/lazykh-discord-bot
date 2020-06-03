import { CustomTypeormLogger } from '../util/db-logger.util';

export const TypeOrmConfig = (prod: boolean) => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '', 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'lazykh',
  synchronize: !prod,
  migrationsRun: prod,
  migrations: ['dist/migration/**/*.js'],
  keepConnectionAlive: prod,
  maxQueryExecutionTime: -1, // Mark all queries as "slow" so we time them all
  logger: new CustomTypeormLogger(),
  entities: ['src/**/*.entity.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  poolErrorHandler: (err: any) => console.error(err),
  extra: {
    query_timeout: 5000,
    statement_timeout: 4000,
    idle_in_transaction_session_timeout: 2000,
    max: 30,
  },
});
