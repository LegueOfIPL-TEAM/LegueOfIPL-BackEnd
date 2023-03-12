import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoService } from 'src/clan-info/clan-info.service';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { ClanMatchDetailService } from 'src/clan-match-detail/clan-match-detail.service';
import {
  InsertAnyNoneData,
  MatchClanInfoDetails,
} from 'src/commons/dto/game.dto/game.dto';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserBattleLogService } from 'src/nexon-user-battle-log/nexon-user-battle-log.service';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { NexonUserInfoService } from 'src/nexon-user-info/nexon-user-info.service';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { GameRepository } from './game.repository';
import * as dayjs from 'dayjs';
import { MatchDetails } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private clanInfoService: ClanInfoService,
    private clanInfoRepository: ClanInfoRepository,
    private nexonUserBattleLogService: NexonUserBattleLogService,
    private nexonUserBattleLogRepository: NexonUserBattleLogRepository,
    private nexonUserInfoService: NexonUserInfoService,
    private nexonUserInfoRepository: NexonUserInfoRepository,
    private clanMatchDetailService: ClanMatchDetailService,
    private clanMatchDetailRepository: ClanMatchDetailRepository,
  ) {}

  async insertMatchData(matchDetails: AllOfDataAfterRefactoring[]) {
    const gameInfo = matchDetails.flatMap((match) => [
      {
        matchKey: match.matchKey,
        mapName: match.mapName,
        matchTime: dayjs(match.matchTime, 'YYYY.MM.DD (HH:mm)').toDate(),
        plimit: match.plimit,
      },
    ]);

    // user Array
    const nexonUsers = matchDetails
      .flatMap((match) => [match.redUserList, match.blueUserList])
      .flat();

    // clan no array
    const clanInfoNos = matchDetails.flatMap((match) => [
      match.redClanNo,
      match.blueClanNo,
    ]);

    // user NexonSn array
    const userNexonSns = nexonUsers.flatMap((user) => [user.userNexonSn]);

    const allClanInfo = matchDetails.flatMap((match) => [
      {
        matchKey: match.matchKey,
        result:
          match.blueResult === 'win' || match.blueResult === 'lose'
            ? 'blueTeamLose'
            : 'blueTeamWin',
        clanName: match.blueClanName,
        clanNo: match.blueClanNo,
        clanMark1: match.blueClanMark1,
        clanMark2: match.blueClanMark2,
        userList: match.blueUserList,
        targetClanNo: match.redClanNo,
      },
      {
        matchKey: match.matchKey,
        result:
          match.redResult === 'win' || match.redResult === 'lose'
            ? 'redTeamWin'
            : 'redTeamLose',
        clanName: match.redClanName,
        clanNo: match.redClanNo,
        clanMark1: match.redClanMark1,
        clanMark2: match.redClanMark2,
        userList: match.redUserList,
        targetClanNo: match.blueClanNo,
      },
    ]);

    try {
      const existsGameInfo = await this.gameRepository.insertMatchData(
        gameInfo,
      );

      const existsClanInfo = await this.clanInfoRepository.findClanNos(
        clanInfoNos,
      );

      const existsUserInfo =
        await this.nexonUserInfoRepository.findNexonUserInfos(userNexonSns);

      if (existsClanInfo.length === 0 && existsUserInfo.length === 0) {
        const isertAnyNoneData = await this.insertAnyNonExistsData({
          existsGameInfo,
          nexonUserDetails: nexonUsers,
          matchClanDetails: allClanInfo,
        });
        return isertAnyNoneData;
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async insertAnyNonExistsData({
    existsGameInfo,
    nexonUserDetails,
    matchClanDetails,
  }: InsertAnyNoneData) {
    const nonDuplicateClanInfos = [];
    const matchResults = [];
    const battleLogs = [];

    const userSns = nexonUserDetails.flatMap((user) => [user.userNexonSn]);

    matchClanDetails.forEach((item) => {
      // 주어진 데이터중 겹치지 않은 클랜의 정보를 필터링
      const existingItem = nonDuplicateClanInfos.find(
        (i) => i.clanNo === item.clanNo,
      );

      if (!existingItem) {
        nonDuplicateClanInfos.push({
          clanName: item.clanName,
          clanNo: item.clanNo,
          clanMark1: item.clanMark1,
          clanMark2: item.clanMark2,
        });
      }
    });

    const createClanInfos =
      await this.clanInfoRepository.createClanInfoNoneDuplicate(
        nonDuplicateClanInfos,
      );

    matchClanDetails.forEach((item) => {
      // 생성된 ClanInfo에서 id 수급
      const ourClanInfo = createClanInfos.find((i) => i.clanNo === item.clanNo);

      // 주어진 데이터를 이용하여 생성된 Game테이블 id 수급
      const gameInfos = existsGameInfo.find(
        (i) => i.matchKey === item.matchKey,
      );

      if (gameInfos) {
        matchResults.push({
          isRedTeam:
            item?.result === 'redTeamWin' || item?.result === 'redTeamLose'
              ? true
              : false,
          isBlueTeam:
            item?.result === 'blueTeamWin' || item?.result === 'blueTeamLose'
              ? true
              : false,
          result:
            item?.result === 'redTeamWin' || item?.result === 'blueTeamWin'
              ? true
              : false,
          gameId: gameInfos.id,
          clanId: ourClanInfo.id,
        });
      }
    });

    const createMatchResults =
      await this.clanMatchDetailRepository.createClanMatchDetail(matchResults);

    const createNexonUserInfos =
      await this.nexonUserInfoRepository.createAllNexonUser(userSns);

    matchClanDetails.forEach((matchDetail) => {
      const usertBattleLogs = matchDetail.userList.map(
        ({
          nickname,
          userNexonSn,
          kill,
          death,
          assist,
          damage,
          grade,
          weapon,
        }) => {
          const existsUser = createNexonUserInfos.find(
            (u) => u.userNexonSn === userNexonSn,
          );
          const existsGame = existsGameInfo.find(
            (game) => game.matchKey === matchDetail.matchKey,
          );
          const response = {
            nickname,
            kill,
            death,
            assist,
            damage,
            grade,
            weapon,
            gameId: existsGame.id,
            nexonUserId: existsUser.id,
          };

          return response;
        },
      );

      battleLogs.push(usertBattleLogs);
    });

    const flatBattleLogs = battleLogs.flat();

    const createUserBattleLogs =
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        flatBattleLogs,
      );

    const response = {
      existsGameInfo,
      createClanInfos,
      createMatchResults,
      createNexonUserInfos,
      createUserBattleLogs,
    };

    return response;
  }
}
