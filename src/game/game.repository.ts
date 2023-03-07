import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  CLAN_INFO,
  ClAN_MATCH_DETAIL,
  GAME_ENTITY,
  NEXON_USER_BATTLE_LOG,
  NEXON_USER_INFO,
} from 'src/core/constants';
import { Game } from './table/game.entity';
import { ClanInfo } from '../clan-info/table/clan-info.entity';
import { NexonUserInfo } from '../nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserBattleLog } from '../nexon-user-battle-log/table/nexon-user-battle-log.entitiy';
import { ClanMatchDetail } from '../clan-match-detail/table/clan-match-detail.entity';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class GameRepository {
  constructor(
    @Inject(GAME_ENTITY)
    private gameEntity: typeof Game, // @Inject(NEXON_USER_INFO)
  ) {}
  async insertMatchData(matchData: AllOfDataAfterRefactoring[]) {
    const createMatchDatas = matchData.map(async (matchDetails) => {
      const { matchKey, matchTime, mapName, matchName, plimit } = matchDetails;

      const convertedTime = dayjs(matchTime, 'YYYY.MM.DD (HH:mm)').format(
        'YYYY-MM-DD HH:mm',
      );

      const insertDb = await this.gameEntity.bulkCreate([
        {
          matchKey,
          matchTime,
          mapName,
          plimit,
        },
      ]);

      return insertDb;
    });

    return createMatchDatas;
  }

  async findAllMatchKey(matchKey: Array<string>) {
    const findAllMatchKeysInGame = await this.gameEntity.findAll({
      where: {
        matchKey: matchKey,
      },
    });

    return findAllMatchKeysInGame;
  }
}
