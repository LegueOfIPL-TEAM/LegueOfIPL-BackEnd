import { Sequelize } from 'sequelize-typescript';
import { Board } from '../table/board.model';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { Game } from 'src/game/table/game.entity';
import { ClanInfo } from 'src/game/table/clanInfo.entity';
import { NexonUserInfo } from 'src/game/table/nexonUserInfo.entitiy';
import { NexonUserBattleLog } from 'src/game/table/nexonUserBattleLog.entitiy';
import { ClanMatchDetail } from 'src/game/table/clanMatchDetail.entity';

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
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        Board,
        Game,
        ClanInfo,
        NexonUserInfo,
        NexonUserBattleLog,
        ClanMatchDetail,
      ]);
      await sequelize.sync({ force: true });
      return sequelize;
    },
  },
];
