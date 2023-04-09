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
import { GameDetails } from 'src/commons/dto/game.dto/game.dto';

@Injectable()
export class GameRepository {
  constructor(
    @Inject(GAME_ENTITY)
    private gameEntity: typeof Game, // @Inject(NEXON_USER_INFO)
  ) {}
  async insertMatchData(gameInfo: GameDetails[]) {
    const insertGameInfoResponse = gameInfo.map(
      async ({ matchKey, mapName, matchTime, plimit }) => {
        return await this.gameEntity.bulkCreate([
          {
            matchKey,
            mapName,
            matchTime,
            plimit,
          },
        ]);
      },
    );

    const response = await Promise.all(insertGameInfoResponse);
    const flatResponse = response.flat();

    return flatResponse;
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
