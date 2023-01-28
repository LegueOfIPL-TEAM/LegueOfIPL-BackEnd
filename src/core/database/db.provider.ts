import { Sequelize } from 'sequelize-typescript';
import { Board } from '../table/board.model';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV as any) {
        case DEVELOPMENT:
          config = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_DEVELOPMENT,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
          }
          break;
        case TEST:
          config = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_TEST,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT
          }
          break;
        case PRODUCTION:
          config = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_PRODUCTION,
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT
          }
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([Board]);
      await sequelize.sync({
        force: true,
      });
      return sequelize;
    },
  },
];