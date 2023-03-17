import { Sequelize } from 'sequelize-typescript';
import { Board } from '../../board/table/board.model';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Game } from 'src/game/table/game.entity';
import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserBattleLog } from 'src/nexon-user-battle-log/table/nexon-user-battle-log.entitiy';
import { ClanMatchDetail } from 'src/clan-match-detail/table/clan-match-detail.entity';
import { Logger } from '@nestjs/common';

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
          };
          break;
        case TEST:
          config = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_TEST,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
          };
          break;
        case PRODUCTION:
          config = {
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_PRODUCTION,
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
          };
          break;
        default:
          config = databaseConfig.development;
      }
      try {
        const sequelize = new Sequelize(config);
        sequelize.addModels([
          Board,
          Game,
          ClanInfo,
          NexonUserInfo,
          NexonUserBattleLog,
          ClanMatchDetail,
        ]);
        await sequelize.authenticate();
        Logger.log('Connection has been established successfully.');
        await sequelize.sync({ force: false });
        return sequelize;
      } catch (err) {
        Logger.error('Unable to connect to the database:', err);
      }
    },
  },
];
