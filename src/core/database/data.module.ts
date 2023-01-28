import { Module } from '@nestjs/common';
import { databaseConfig } from './database.config';
import { databaseProviders } from './db.provider';


@Module({
  providers: [...databaseProviders,],
  exports: [...databaseProviders],
})
export class DatabaseModule {}