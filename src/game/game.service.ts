import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoService } from 'src/clan-info/clan-info.service';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { ClanMatchDetailService } from 'src/clan-match-detail/clan-match-detail.service';
import {
  InsertAnyNoneData,
  MissingPlayerInsert,
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
import { NexonUserInsertDb } from 'src/commons/dto/nexon-user-info.dto/nexon-user-info.dto';

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

    const nonDpulicateClanInfoNos = clanInfoNos.filter(
      (value, index) => clanInfoNos.indexOf(value) === index,
    );

    // user NexonSn array
    const userNexonSns = nexonUsers.flatMap((user) => [user.userNexonSn]);

    const nonDpulicateSnNos = userNexonSns.filter(
      (value, index) => userNexonSns.indexOf(value) === index,
    );

    const allClanInfo = matchDetails.flatMap((match) => [
      {
        matchKey: match.matchKey,
        result: match.blueResult === 'win' ? 'blueTeamWin' : 'blueTeamLose',
        clanName: match.blueClanName,
        clanNo: match.blueClanNo,
        clanMark1: match.blueClanMark1,
        clanMark2: match.blueClanMark2,
        userList: match.blueUserList,
        targetClanNo: match.redClanNo,
      },
      {
        matchKey: match.matchKey,
        result: match.redResult === 'win' ? 'redTeamWin' : 'redTeamLose',
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
        const isertAnyNoneData = await this.processClanMatchDetails({
          existsGameInfo,
          matchClanDetails: allClanInfo,
        });

        return isertAnyNoneData;
      }

      if (
        existsClanInfo.length === nonDpulicateClanInfoNos.length &&
        existsUserInfo.length !== nonDpulicateSnNos.length
      ) {
        console.log('this', '654628680');
        const missingUser = await this.createMissingPlayers({
          existsPlayer: existsUserInfo,
          existsGameInfo,
          matchInfos: allClanInfo,
        });

        return missingUser;
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async processClanMatchDetails({
    existsGameInfo,
    matchClanDetails,
  }: InsertAnyNoneData) {
    const winLossCounts = matchClanDetails.reduce(
      (counts, { clanName, result }) => {
        counts[clanName] = counts[clanName] || { clanName, wins: 0, losses: 0 };
        counts[clanName][result.endsWith('Win') ? 'wins' : 'losses']++;
        return counts;
      },
      {},
    );

    const userWinLossCounts = matchClanDetails.reduce((acc, cur) => {
      const { userList, result } = cur;

      userList.forEach((user) => {
        const { userNexonSn } = user;
        acc[userNexonSn] = acc[userNexonSn] || {
          userNexonSn,
          ladderPoint: 1000,
        };

        if (result.endsWith('Win')) {
          acc[userNexonSn].ladderPoint += 15;
        } else {
          acc[userNexonSn].ladderPoint -= 11;
        }
      });

      return acc;
    }, {});

    const ladderPoints = Object.values(winLossCounts).map(
      ({ clanName, wins, losses }) => {
        return { clanName, ladderPoint: 1000 + wins * 15 - losses * 11 };
      },
    );

    const userLadderPointsWithUserNexonSn = Object.values(
      userWinLossCounts,
    ).map(({ ladderPoint, userNexonSn }: NexonUserInsertDb) => {
      return { userNexonSn, ladderPoint };
    });

    const clanInfos = matchClanDetails.reduce(
      (infos, { clanName, result, clanNo, clanMark1, clanMark2 }) => {
        const existing = infos.find((i) => i.clanNo === clanNo);
        const ladderPoint =
          ladderPoints.find((lp) => lp.clanName === clanName)?.ladderPoint || 0;
        if (!existing) {
          infos.push({
            clanName,
            result,
            clanNo,
            clanMark1,
            clanMark2,
            ladderPoint,
          });
        }
        return infos;
      },
      [],
    );

    const createClanInfos =
      await this.clanInfoRepository.createClanInfoNoneDuplicate(clanInfos);

    const matchResults = matchClanDetails
      .map(({ matchKey, clanNo, result }) => {
        const game = existsGameInfo.find((g) => g.matchKey === matchKey);
        const clan = createClanInfos.find((c) => c.clanNo === clanNo);
        return game && clan
          ? {
              gameId: game.id,
              clanId: clan.id,
              isRedTeam: result.includes('redTeam'),
              isBlueTeam: result.includes('blueTeam'),
              result: result.endsWith('Win'),
            }
          : null;
      })
      .filter(Boolean);

    const createMatchResults =
      await this.clanMatchDetailRepository.createClanMatchDetail(matchResults);

    const nexonUsers = await this.nexonUserInfoRepository.createAllNexonUser(
      userLadderPointsWithUserNexonSn,
    );

    const battleLogs = matchClanDetails.flatMap(({ matchKey, userList }) => {
      const gameId = existsGameInfo.find((g) => g.matchKey === matchKey)?.id;
      if (!gameId) {
        return [];
      }
      return userList.map(
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
          const nexonUserId = nexonUsers.find(
            (u) => u.userNexonSn === userNexonSn,
          )!.id;

          const response = {
            gameId,
            nexonUserId,
            nickname,
            kill,
            death,
            assist,
            damage,
            grade,
            weapon,
          };

          return response;
        },
      );
    });

    const createUserBattleLogs =
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        battleLogs,
      );

    return {
      existsGameInfo,
      createClanInfos,
      createMatchResults,
      nexonUsers,
      createUserBattleLogs,
    };
  }

  async createMissingPlayers({
    existsPlayer,
    existsGameInfo,
    matchInfos,
  }: MissingPlayerInsert) {
    const userWinLossCounts = matchInfos.reduce((acc, cur) => {
      const { userList, result } = cur;

      userList.forEach((user) => {
        const { userNexonSn } = user;
        acc[userNexonSn] = acc[userNexonSn] || {
          userNexonSn,
          ladderPoint: 1000,
        };

        if (result.endsWith('Win')) {
          acc[userNexonSn].ladderPoint += 15;
        } else {
          acc[userNexonSn].ladderPoint -= 11;
        }
      });

      return acc;
    }, {});

    const existsUserLadderPoint = matchInfos.reduce((acc, cur) => {
      const { result, userList } = cur;

      userList.forEach((user) => {
        const findUser = existsPlayer.find(
          (u) => u.userNexonSn === user.userNexonSn,
        );

        acc[findUser.userNexonSn] = acc[findUser.userNexonSn] || {
          userNexonSn: findUser.userNexonSn,
          ladderPoint: findUser.ladderPoint,
        };

        if (result.endsWith('Win')) {
          acc[findUser.userNexonSn].ladderPoint += 15;
        } else {
          acc[findUser.userNexonSn].ladderPoint -= 11;
        }
      });

      return acc;
    }, {});

    return test;

    // existsUser update data

    // nonExistsUser create data
  }
}
