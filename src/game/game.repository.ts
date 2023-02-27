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

@Injectable()
export class GameRepository {
  constructor(
    @Inject(GAME_ENTITY)
    private gameEntity: typeof Game, // @Inject(NEXON_USER_INFO)
  ) {}

  // async refactoringDataPushInDb(refactoringData: AllOfDataAfterRefactoring[]) {
  //   refactoringData.forEach((matchData) => {
  //     const {
  //       matchKey,
  //       matchTime,
  //       mapName,
  //       plimit,
  //       redResult,
  //       redClanNo,
  //       redClanName,
  //       redClanMark1,
  //       redClanMark2,
  //       redUserList,
  //       blueResult,
  //       blueClanNo,
  //       blueClanName,
  //       blueClanMark1,
  //       blueClanMark2,
  //       blueUserList,
  //     } = matchData;

  //     try {
  //       if (redResult === 'win') {
  //         const isExistsInRankClan = this.gameEntity.findAll({
  //           where: {

  //           }
  //         })

  //       }
  //       // if blue team win db insert

  //     } catch (e) {
  //       throw new HttpException(500, 'db insert error');
  //     }
  //   });
  // }
}
