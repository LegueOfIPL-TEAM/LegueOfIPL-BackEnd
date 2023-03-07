import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoService } from 'src/clan-info/clan-info.service';
import { ClanMatchDetailService } from 'src/clan-match-detail/clan-match-detail.service';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserBattleLogService } from 'src/nexon-user-battle-log/nexon-user-battle-log.service';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { NexonUserInfoService } from 'src/nexon-user-info/nexon-user-info.service';
import { GameRepository } from './game.repository';

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private clanInfoService: ClanInfoService,
    private nexonUserBattleLogService: NexonUserBattleLogService,
    private nexonUserInfoService: NexonUserInfoService,
    private nexonUserInfoRepository: NexonUserInfoRepository,
    private clanMatchDetailService: ClanMatchDetailService,
  ) {}

  async insertMatchData(matchDetails: AllOfDataAfterRefactoring[]) {
    // matchKey Array
    const matchKeys = matchDetails.flatMap((match) => [match.matchKey]);

    // user Array
    const nexonUsers = matchDetails
      .flatMap((match) => [match.redUserList, match.blueUserList])
      .flat();

    // user NexonSn array
    const userNexonSns = nexonUsers.flatMap((user) => [user.userNexonSn]);

    try {
      const DataSetToInsertBattleLogs =
        this.nexonUserBattleLogService.refactoringDataWithUserId({
          userNexonSns,
          nexonUsers,
        });

      return DataSetToInsertBattleLogs;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
