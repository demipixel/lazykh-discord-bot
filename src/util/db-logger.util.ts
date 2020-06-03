import { QueryRunner, Logger } from 'typeorm';

const MIN_MS_FOR_SLOW_QUERY = 400;

export class CustomTypeormLogger implements Logger {
  // Never called since all queries are considered "slow" so they're timed automatically
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    return;
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    console.error('SQL: ' + query, { parameters, error });
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const slow = time >= MIN_MS_FOR_SLOW_QUERY;
    console.log('SQL' + (slow ? ' SLOW' : '') + ': ' + query, {
      parameters,
      sec: time / 1000,
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    console.log('SQL SCHEMA BUILD: ' + message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    console.log('SQL MIGRATION: ' + message);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    console.log(message);
  }
}
