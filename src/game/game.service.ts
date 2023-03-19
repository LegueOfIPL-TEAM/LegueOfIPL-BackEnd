import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoService } from 'src/clan-info/clan-info.service';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { ClanMatchDetailService } from 'src/clan-match-detail/clan-match-detail.service';
import {
  BattleLogsWithRelation,
  InsertAnyNoneData,
  MatchDetailsWithRelation,
  MatchOneOfClanDetail,
  MissingPlayerInsert,
} from 'src/commons/dto/game.dto/game.dto';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserBattleLogService } from 'src/nexon-user-battle-log/nexon-user-battle-log.service';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { NexonUserInfoService } from 'src/nexon-user-info/nexon-user-info.service';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { GameRepository } from './game.repository';
import * as dayjs from 'dayjs';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';
import { NexonUserInsertDb } from 'src/commons/dto/nexon-user-info.dto/nexon-user-info.dto';

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private clanInfoRepository: ClanInfoRepository,
    private nexonUserBattleLogRepository: NexonUserBattleLogRepository,
    private nexonUserInfoRepository: NexonUserInfoRepository,
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
        return await this.processClanMatchDetails({
          existsGameInfo,
          matchClanDetails: allClanInfo,
        });
      }

      if (
        existsClanInfo.length === nonDpulicateClanInfoNos.length &&
        existsUserInfo.length !== nonDpulicateSnNos.length
      ) {
        return await this.createMissingPlayers({
          existsPlayer: existsUserInfo,
          existsGameInfo,
          existsClan: existsClanInfo,
          matchInfos: allClanInfo,
        });
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async processClanMatchDetails({
    existsGameInfo,
    matchClanDetails,
  }: InsertAnyNoneData) {
    const { userLadder, clanLadder } = this.ladderPointAcc(matchClanDetails);

    const createClanInfos =
      await this.clanInfoRepository.createClanInfoNoneDuplicate(clanLadder);

    const matchDetailsWithRelation = this.matchDetailWithRelation({
      matchDetails: matchClanDetails,
      existsGameInfo,
      clanInfos: createClanInfos,
    });

    const createMatchResults =
      await this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      );

    const nexonUsers = await this.nexonUserInfoRepository.createAllNexonUser(
      userLadder,
    );

    const battleLogs = this.userBattleLogsWithRelation({
      matchDetails: matchClanDetails,
      existsGameInfo,
      existsNexonUser: nexonUsers,
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
    existsClan,
    matchInfos,
  }: MissingPlayerInsert) {
    const existingUsers = [];
    const newUsers = [];
    const existsClanLadder = [];

    matchInfos.forEach(({ userList, result, clanNo }) => {
      const clan = existsClan.find((clan) => clan.clanNo === clanNo);

      const clanLadder = {
        id: clan.id,
        ladderPoint: clan.ladderPoint,
      };

      clanLadder.ladderPoint += result.endsWith('Win') ? 15 : -11;

      existsClanLadder.push(clanLadder);

      userList.forEach((user) => {
        const findUser = existsPlayer.find(
          (u) => u.userNexonSn === user.userNexonSn,
        );

        if (findUser) {
          const updatedUser = {
            userNexonSn: findUser.userNexonSn,
            ladderPoint: findUser.ladderPoint,
          };

          updatedUser.ladderPoint += result.endsWith('Win') ? 15 : -11;

          existingUsers.push(updatedUser);
        } else {
          const newUser = {
            userNexonSn: user.userNexonSn,
            ladderPoint: 1000,
          };

          newUser.ladderPoint += result.endsWith('Win') ? 15 : -11;

          newUsers.push(newUser);
        }
      });
    });

    const [updateLadderExistsClan, updateExistsUserLadderPoint, createNewUser] =
      await Promise.all([
        this.clanInfoRepository.updateClanLadder(existsClanLadder),
        this.nexonUserInfoRepository.existsUsersUpdate(existingUsers),
        this.nexonUserInfoRepository.createAllNexonUser(newUsers),
      ]);

    const allUsers = [...updateExistsUserLadderPoint, ...createNewUser];

    const matchDetailsWithRelation = this.matchDetailWithRelation({
      matchDetails: matchInfos,
      existsGameInfo,
      clanInfos: updateLadderExistsClan,
    });

    const battleLogs = this.userBattleLogsWithRelation({
      matchDetails: matchInfos,
      existsGameInfo,
      existsNexonUser: allUsers,
    });

    const [createMatchDetails, createUserBattleLogs] = await Promise.all([
      this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      ),
      this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        battleLogs,
      ),
    ]);

    return {
      allUsers,
      createMatchDetails,
      createUserBattleLogs,
    };
  }

  ladderPointAcc(matchDetails: MatchOneOfClanDetail[]) {
    const userLadder = [];
    const clanLadder = [];

    matchDetails.forEach(
      ({ clanNo, result, userList, clanMark1, clanMark2 }) => {
        const clanLadderPoint = {
          clanNo,
          ladderPoint: 1000,
          clanMark1,
          clanMark2,
        };

        clanLadderPoint.ladderPoint += result.endsWith('Win') ? 15 : -11;

        clanLadder.push(clanLadderPoint);

        userList.forEach(({ userNexonSn }) => {
          const userLadderPoint = {
            userNexonSn,
            ladderPoint: 1000,
          };

          userLadderPoint.ladderPoint += result.endsWith('Win') ? 15 : -11;

          userLadder.push(userLadderPoint);
        });
      },
    );

    return {
      userLadder,
      clanLadder,
    };
  }

  matchDetailWithRelation({
    matchDetails,
    existsGameInfo,
    clanInfos,
  }: MatchDetailsWithRelation) {
    const matchResults = matchDetails
      .map(({ matchKey, clanNo, result }) => {
        const game = existsGameInfo.find((g) => g.matchKey === matchKey);
        const clan = clanInfos.find((c) => c.clanNo === clanNo);
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

    return matchResults;
  }

  userBattleLogsWithRelation({
    matchDetails,
    existsGameInfo,
    existsNexonUser,
  }: BattleLogsWithRelation) {
    const battleLogs = matchDetails.flatMap(({ matchKey, userList }) => {
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
          const nexonUserId = existsNexonUser.find(
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
    return battleLogs;
  }
}
