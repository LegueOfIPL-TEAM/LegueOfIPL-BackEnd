import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import {
  BattleLogsWithRelation,
  CreateClanAndUserDTO,
  MatchDetailsWithRelation,
  UpdateAndCreateAllMatchData,
  updateClanAndUserLadderDto,
  updateLadderPointMissingData,
} from 'src/commons/dto/game.dto/game.dto';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { GameRepository } from './game.repository';
import * as dayjs from 'dayjs';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';

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

    const oneOfMatchDetail = matchDetails.flatMap((match) => [
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

    console.log('hello');

    try {
      const existsGameInfo = await this.gameRepository.insertMatchData(
        gameInfo,
      );

      const existsClanInfo = await this.clanInfoRepository.findClanNos(
        nonDpulicateClanInfoNos,
      );

      const existsUserInfo =
        await this.nexonUserInfoRepository.findNexonUserInfos(
          nonDpulicateSnNos,
        );

      const { clan, newClan, user, newUser } =
        this.updateLadderPointInMissingData({
          matchDetails: oneOfMatchDetail,
          existsClan: existsClanInfo,
          existsUser: existsUserInfo,
        });

      if (newUser.length === 0 && newClan.length === 0) {
        if (clan.length !== 0 || user.length !== 0) {
          // request update query to database
          return await this.updateClanAndUserLadder({
            matchDetails: oneOfMatchDetail,
            existingClan: clan,
            existingUser: user,
            existingGame: existsGameInfo,
          });
        }
      } else if (user.length === 0 && clan.length === 0) {
        if (newUser.length !== 0 && newClan.length !== 0) {
          // request create query to database
          return await this.createClanAndUser({
            matchDetails: oneOfMatchDetail,
            newClan,
            newUser,
            existingGame: existsGameInfo,
          });
        }
      } else {
        // mixed case, requires both create and update queries
        return await this.updateAndCreateAllMatchData({
          matchDetails: oneOfMatchDetail,
          existingClan: clan,
          newClan,
          existingUser: user,
          newUser,
          existingGame: existsGameInfo,
        });
      }
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async updateClanAndUserLadder({
    matchDetails,
    existingClan,
    existingUser,
    existingGame,
  }: updateClanAndUserLadderDto) {
    const [updateUserLadderPoint, updateClanLadderPoint] = await Promise.all([
      await this.nexonUserInfoRepository.existsUsersUpdate(existingUser),
      await this.clanInfoRepository.updateClanLadder(existingClan),
    ]);

    const matchDetailsWithRelation = this.matchDetailWithRelation({
      matchDetails,
      existsGameInfo: existingGame,
      clanInfos: updateClanLadderPoint,
    });

    const battleLogs = this.userBattleLogsWithRelation({
      matchDetails: matchDetails,
      existsGameInfo: existingGame,
      existsNexonUser: updateUserLadderPoint,
    });

    const [createMatchDetails, createBattleLogs] = await Promise.all([
      await this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      ),
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        battleLogs,
      ),
    ]);

    return {
      existingGame,
      updateClanLadderPoint,
      createMatchDetails,
      updateUserLadderPoint,
      createBattleLogs,
    };
  }

  async createClanAndUser({
    matchDetails,
    newClan,
    newUser,
    existingGame,
  }: CreateClanAndUserDTO) {
    const [createUser, createClan] = await Promise.all([
      await this.nexonUserInfoRepository.createAllNexonUser(newUser),
      await this.clanInfoRepository.createClanInfoNoneDuplicate(newClan),
    ]);

    const matchDetailsWithRelation = this.matchDetailWithRelation({
      matchDetails,
      existsGameInfo: existingGame,
      clanInfos: createClan,
    });

    const battleLogs = this.userBattleLogsWithRelation({
      matchDetails: matchDetails,
      existsGameInfo: existingGame,
      existsNexonUser: createUser,
    });

    const [createMatchDetails, createBattleLogs] = await Promise.all([
      await this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      ),
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        battleLogs,
      ),
    ]);

    return {
      existingGame,
      createClan,
      createMatchDetails,
      createUser,
      createBattleLogs,
    };
  }

  async updateAndCreateAllMatchData({
    matchDetails,
    existingClan,
    newClan,
    existingUser,
    newUser,
    existingGame,
  }: UpdateAndCreateAllMatchData) {
    const [createClan, updateClan, createUser, updateUser] = await Promise.all([
      await this.clanInfoRepository.updateClanLadder(existingClan),
      await this.clanInfoRepository.createClanInfoNoneDuplicate(newClan),
      await this.nexonUserInfoRepository.existsUsersUpdate(existingUser),
      await this.nexonUserInfoRepository.createAllNexonUser(newUser),
    ]);

    const allClan = [...createClan, ...updateClan];
    const allUser = [...createUser, ...updateUser];

    const matchDetailsWithRelation = this.matchDetailWithRelation({
      matchDetails,
      existsGameInfo: existingGame,
      clanInfos: allClan,
    });

    const battleLogs = this.userBattleLogsWithRelation({
      matchDetails: matchDetails,
      existsGameInfo: existingGame,
      existsNexonUser: allUser,
    });

    const [createMatchDetails, createBattleLogs] = await Promise.all([
      await this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      ),
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        battleLogs,
      ),
    ]);

    return {
      existingGame,
      allClan,
      createMatchDetails,
      allUser,
      createBattleLogs,
    };
  }

  updateLadderPointInMissingData({
    matchDetails,
    existsClan,
    existsUser,
  }: updateLadderPointMissingData) {
    const clan = [];
    const newClan = [];
    const user = [];
    const newUser = [];

    matchDetails.forEach(
      ({ clanName, clanNo, result, userList, clanMark1, clanMark2 }) => {
        const ladderPoint = result.endsWith('Win') ? 15 : -11;

        const existingClanIndex = existsClan.findIndex(
          (c) => c.clanNo === clanNo,
        );

        if (existingClanIndex !== -1) {
          const existingClan = existsClan[existingClanIndex];
          existingClan.ladderPoint += ladderPoint;
          clan.push(existingClan);
        } else {
          let newClanIndex = newClan.findIndex((c) => c.clanNo === clanNo);

          if (newClanIndex === -1) {
            newClan.push({
              clanName,
              clanNo,
              clanMark1,
              clanMark2,
              ladderPoint: 1000,
            });

            newClanIndex = newClan.length - 1;
          }
          newClan[newClanIndex].ladderPoint += ladderPoint;
        }

        userList.forEach(({ userNexonSn }) => {
          const existsUserIndex = existsUser.findIndex(
            (u) => u.userNexonSn === userNexonSn,
          );

          if (existsUserIndex !== -1) {
            const existingUser = existsUser[existsUserIndex];
            existingUser.ladderPoint += ladderPoint;
            user.push(existingUser);
          } else {
            let newUserIndex = newUser.findIndex(
              (u) => u.userNexonSn === userNexonSn,
            );

            if (newUserIndex === -1) {
              newUser.push({
                userNexonSn,
                ladderPoint: 1000,
              });
              newUserIndex = newUser.length - 1;
            }
            newUser[newUserIndex].ladderPoint += ladderPoint;
          }
        });
      },
    );

    return { clan, newClan, user, newUser };
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
