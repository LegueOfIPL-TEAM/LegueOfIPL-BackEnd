import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import {
  BattleLogsAndMatchDetailWithRelation,
  CreateClanAndUserDTO,
  UpdateAndCreateAllMatchData,
  updateClanAndUserLadderDto,
  updateLadderPointMissingData,
} from 'src/commons/dto/game.dto/game.dto';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { GameRepository } from './game.repository';

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
    const gameInfo = matchDetails.map(({ matchKey, matchTime }) => {
      const formatString = 'YYYY.MM.DD (HH:mm)';
      const parsedDate = dayjs(
        matchTime.replace('(', '').replace(')', ''),
        formatString,
      );
      const formattedDate = parsedDate.format('YYYY-MM-DD HH:mm:ss');

      return {
        matchKey,
        matchTime: formattedDate,
      };
    });

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
      },
      {
        matchKey: match.matchKey,
        result: match.redResult === 'win' ? 'redTeamWin' : 'redTeamLose',
        clanName: match.redClanName,
        clanNo: match.redClanNo,
        clanMark1: match.redClanMark1,
        clanMark2: match.redClanMark2,
        userList: match.redUserList,
      },
    ]);

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

      const { clan, newClan, user, newUser } = this.clanAndUserObjectInMatch({
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

    const { createMatchDetails, createBattleLogs } =
      await this.battleLogAndMatchDetailWithRelation({
        matchDetails,
        existsGameInfo: existingGame,
        existsNexonUser: existingUser,
        existingClan,
      });

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

    const { createMatchDetails, createBattleLogs } =
      await this.battleLogAndMatchDetailWithRelation({
        matchDetails,
        existsGameInfo: existingGame,
        existsNexonUser: createUser,
        existingClan: createClan,
      });

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

    const { createMatchDetails, createBattleLogs } =
      await this.battleLogAndMatchDetailWithRelation({
        matchDetails,
        existsGameInfo: existingGame,
        existsNexonUser: allUser,
        existingClan: allClan,
      });

    return {
      existingGame,
      allClan,
      createMatchDetails,
      allUser,
      createBattleLogs,
    };
  }

  clanAndUserObjectInMatch({
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
        const clanWinningCount = result.endsWith('Win') ? 1 : 0;
        const clanLoseCount = result.endsWith('Lose') ? 1 : 0;

        const existingClanIndex = existsClan.findIndex(
          (c) => c.clanNo === clanNo,
        );

        if (existingClanIndex !== -1) {
          const existingClan = existsClan[existingClanIndex];

          existingClan.ladderPoint += ladderPoint;

          const winCount = (existingClan.winCount += clanWinningCount);
          const loseCount = (existingClan.loseCount += clanLoseCount);
          const totalCount = (existingClan.totalWinningPoint =
            winCount + loseCount);

          const winningRate = (winCount / totalCount) * 100;
          const winRateRounded = winningRate.toFixed(1);

          existingClan.winningRate = winRateRounded;
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
              winCount: 0,
              loseCount: 0,
              totalWinningPoint: 0,
              winningRate: 0,
            });

            newClanIndex = newClan.length - 1;
          }
          newClan[newClanIndex].ladderPoint += ladderPoint;

          const winCount = (newClan[newClanIndex].winCount += clanWinningCount);
          const loseCount = (newClan[newClanIndex].loseCount += clanLoseCount);

          const totalCount = (newClan[newClanIndex].totalWinningPoint =
            winCount + loseCount);

          const winningRate = (winCount / totalCount) * 100;
          const winRateRounded = winningRate.toFixed(1);
          newClan[newClanIndex].winningRate = winRateRounded;
        }

        userList.forEach(({ userNexonSn, kill, death }) => {
          const existsUserIndex = existsUser.findIndex(
            (u) => u.userNexonSn === userNexonSn,
          );

          if (existsUserIndex !== -1) {
            const existingUser = existsUser[existsUserIndex];

            existingUser.ladderPoint += ladderPoint;

            const winCount = (existingUser.winCount += clanWinningCount);
            const loseCount = (existingUser.loseCount += clanLoseCount);

            const totalWinningPoint = winCount + loseCount;

            const winningRate = (winCount / totalWinningPoint) * 100;
            const winningRateRounded = winningRate.toFixed(1);

            existingUser.winningRate = winningRateRounded;
            existingUser.totalWinningPoint = winCount + loseCount;

            const killPoint = (existingUser.killPoint += kill);
            const deatPoint = (existingUser.deathPoint += death);
            const totalKd = (existingUser.totalKd = killPoint + deatPoint);

            const kd = (killPoint / totalKd) * 100;
            const kdRounded = kd.toFixed(1);

            existingUser.kdRate = kdRounded;

            user.push(existingUser);
          } else {
            let newUserIndex = newUser.findIndex(
              (u) => u.userNexonSn === userNexonSn,
            );

            if (newUserIndex === -1) {
              newUser.push({
                userNexonSn,
                ladderPoint: 1000,
                killPoint: 0,
                deathPoint: 0,
                totalKd: 0,
                kdRate: 0,
                winCount: 0,
                loseCount: 0,
                totalWinningPoint: 0,
                winningRate: 0,
              });
              newUserIndex = newUser.length - 1;
            }

            newUser[newUserIndex].ladderPoint += ladderPoint;

            const winCount = (newUser[newUserIndex].winCount +=
              clanWinningCount);

            const loseCount = (newUser[newUserIndex].loseCount +=
              clanLoseCount);

            const totalWinningPoint = (newUser[newUserIndex].totalWinningPoint =
              winCount + loseCount);

            const winningRate = (winCount / totalWinningPoint) * 100;

            const winningRateRounded = winningRate.toFixed(1);

            newUser[newUserIndex].winningRate = winningRateRounded;

            const killPoint = (newUser[newUserIndex].killPoint += kill);
            const deatPoint = (newUser[newUserIndex].deathPoint += death);
            const totalKd = (newUser[newUserIndex].totalKd =
              killPoint + deatPoint);
            const kd = (killPoint / totalKd) * 100;
            const kdRounded = kd.toFixed(1);
            const kdRate = (newUser[newUserIndex].kdRate = kdRounded);
          }
        });
      },
    );

    return { clan, newClan, user, newUser };
  }

  async battleLogAndMatchDetailWithRelation({
    matchDetails,
    existsGameInfo,
    existsNexonUser,
    existingClan,
  }: BattleLogsAndMatchDetailWithRelation) {
    const clanRating = [];
    const battleLogs = [];
    const matchDetailsWithRelation = [];
    matchDetails.forEach(({ matchKey, userList, clanNo, result }) => {
      const gameId = existsGameInfo.find((g) => g.matchKey === matchKey)?.id;
      const clan = existingClan.find((c) => c.clanNo === clanNo);
      if (!gameId && !clan) {
        return [];
      }
      const matchDetail = {
        gameId,
        clanId: clan.id,
        isRedTeam: result.includes('redTeam'),
        isBlueTeam: result.includes('blueTeam'),
        result: result.endsWith('Win'),
      };

      matchDetailsWithRelation.push(matchDetail);

      userList.map(
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

          battleLogs.push({
            gameId,
            nexonUserId,
            isRedTeam: result.includes('redTeam'),
            isBlueTeam: result.includes('blueTeam'),
            nickname,
            kill,
            death,
            assist,
            damage,
            grade,
            weapon,
            matchId: null,
          });
        },
      );
    });

    const createMatchDetails =
      await this.clanMatchDetailRepository.createClanMatchDetail(
        matchDetailsWithRelation,
      );

    const updatedBattleLogs = battleLogs.map(
      ({ isBlueTeam, isRedTeam, gameId, matchId, ...rest }) => {
        const findMatchId = createMatchDetails.find(
          (match) =>
            match.gameId === gameId &&
            match.isRedTeam === isRedTeam &&
            match.isBlueTeam === isBlueTeam,
        )?.id;
        return {
          gameId,
          ...rest,
          matchId: findMatchId,
        };
      },
    );

    const createBattleLogs =
      await this.nexonUserBattleLogRepository.createMatchDetailsWithUserId(
        updatedBattleLogs,
      );

    return { createMatchDetails, createBattleLogs };
  }
}
