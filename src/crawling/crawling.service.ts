import { Injectable } from '@nestjs/common';
import { enviroment } from 'src/commons/enviroment';
import {
  getManyMatchListAndUrls,
  GameLogs,
  AllUserInMatch,
  AllOfDataAfterRefactoring,
} from 'src/commons/interface/crawling.interface';
import {
  AllOfDataBeforRefactoring,
  BattleLogs,
} from 'src/commons/dto/crawling.dto/cawling.dto';

@Injectable()
export class CrawlingService {
  async allOfDatasInSa(): Promise<AllOfDataAfterRefactoring[]> {
    const getMatchList = await this.getManyMatchList();

    const { battleLogUrls, matchListInfos, matchResusltUrls } = getMatchList;

    const matchDetails = await this.getMatchDetails(matchResusltUrls);

    const battleLogs = await this.getBattleLog(battleLogUrls);

    const refactBattleLog = this.refactoringBattleLogData(battleLogs);

    const allOfDataWithRefact = this.lastRefacDataOfSa({
      matchListInfos,
      battleLogs: refactBattleLog,
      matchDetails,
    });

    return allOfDataWithRefact;
  }

  async getManyMatchList(): Promise<getManyMatchListAndUrls> {
    const url = enviroment.urlOfMatchList;

    const clienIds = enviroment.clienIds;

    const matchListInfos = [];
    const battleLogUrls = [];
    const matchResusltUrls = [];

    for (const clienId of clienIds) {
      const body = JSON.stringify({
        clan_id: clienId,
      });

      const matchListRequest = {
        method: 'POST',
        url: url,
        body,
        headers: { 'Content-Type': 'application/json' },
      };

      const requestSpecificUrl = await fetch(url, matchListRequest);

      const response = await requestSpecificUrl.json();

      const { result } = response;

      const clanInIPLgue = enviroment.clanNames;

      result.forEach((item) => {
        const {
          map_name: mapName,
          match_name: matchName,
          red_clan_name: redClanName,
          red_clan_mark1: redClanMark1,
          red_clan_mark2: redClanMark2,
          blue_clan_name: blueClanName,
          blue_clan_mark1: blueClanMark1,
          blue_clan_mark2: blueClanMark2,
          plimit,
          result_wdl: resulWdl,
          match_key: matchKey,
          clan_no: clanNo,
        } = item;

        if (
          mapName === '제3보급창고' &&
          plimit === 5 &&
          resulWdl === '승' &&
          clanInIPLgue.includes(blueClanName) &&
          clanInIPLgue.includes(redClanName)
        ) {
          const returnValue = {
            mapName,
            matchName,
            redClanName,
            redClanMark1,
            redClanMark2,
            blueClanName,
            blueClanMark1,
            blueClanMark2,
            plimit,
          };

          const battleLogURL = `https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/${matchKey}/${clanNo}`;
          const matchResultUrl = `https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/${matchKey}/C/${clienId}`;

          battleLogUrls.push(battleLogURL);
          matchResusltUrls.push(matchResultUrl);
          matchListInfos.push(returnValue);
        }
      });
    }
    return { battleLogUrls, matchListInfos, matchResusltUrls };
  }

  async getMatchDetails(urls: string[]) {
    const matchDetails = [];
    for (const [index, url] of urls.entries()) {
      const request = {
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json' },
      };

      const requestSpecificUrl = await fetch(url, request);
      const response = await requestSpecificUrl.json();

      const { matchResultDataInfo, redUserList, blueUserList, myMatchRating } =
        response;
      const {
        lose_team_name: loseTeamName,
        win_team_name: winTeamName,
        match_time: matchTime,
        blue_result: blueResult,
        red_result: redResult,
        blue_clan_no: blueClanNo,
        red_clan_no: redClanNo,
      } = matchResultDataInfo;
      const { match_key: matchKey } = myMatchRating;
      const returnValue = {
        matchKey,
        blueResult,
        blueClanNo,
        redResult,
        redClanNo,
        winTeamName,
        loseTeamName,
        matchTime,
        redUserList: redUserList.map((user) => {
          const { nickname, kill, death, assist, damage, grade } = user;

          const redUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
            grade,
          };
          return redUserResponse;
        }),
        blueUserList: blueUserList.map((user) => {
          const { nickname, kill, death, assist, damage, grade } = user;

          const blueUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
            grade,
          };
          return blueUserResponse;
        }),
      };
      matchDetails.push(returnValue);
    }

    return matchDetails;
  }

  async getBattleLog(urls: string[]): Promise<GameLogs> {
    const matchUserNick = [];

    const results = await Promise.all(
      urls.map(async (url) => {
        const request = {
          method: 'POST',
          url: url,
          headers: { 'Content-Type': 'application/json' },
        };

        const requestSpecificUrl = await fetch(url, request);

        if (requestSpecificUrl.status === 500) return [];

        const response = await requestSpecificUrl.json();

        const { battleLog } = response;

        const battleLogs = battleLog.map((values) => {
          const {
            user_nick: usernick,
            target_user_nick: targetUsernick,
            target_team_no: targetTeamNo,
            weapon,
            target_weapon: targetWeapon,
            event_category: eventCategory,
            target_user_nexon_sn: targetUserNexonSn,
            user_nexon_sn: userNexonSn,
            target_event_type: targetEventType,
          } = values;
          if (
            targetTeamNo !== 0 &&
            eventCategory !== 'mission' &&
            targetEventType !== 'bomb'
          ) {
            const response = {
              winTeamUserNick: usernick,
              eventCategory,
              userNexonSn,
              weapon,
              loseTeamUserNick: targetUsernick,
              targetEventType,
              targetUserNexonSn,
              targetWeapon,
            };

            return response;
          }
        });

        return battleLogs.filter((obj) => obj !== undefined);
      }),
    );
    matchUserNick.push(...results);

    return matchUserNick;
  }

  lastRefacDataOfSa({
    matchListInfos,
    battleLogs,
    matchDetails,
  }: AllOfDataBeforRefactoring): AllOfDataAfterRefactoring[] {
    matchDetails.forEach((match, index) => {
      const { blueResult, blueUserList, redUserList } = match;

      const winnerTeam = blueResult === 'win' ? blueUserList : redUserList;
      const loseTeam = blueResult === 'lose' ? blueUserList : redUserList;
      const winnerInBattleLogs = battleLogs[index]['winnerTeam'];
      const loserInBattleLogs = battleLogs[index]['loseTeam'];

      winnerTeam.forEach((user) => {
        const existingUser = winnerInBattleLogs.find(
          (u) => u.nickname === user.nickname,
        );
        if (existingUser) {
          existingUser.assist = user.assist;
          existingUser.grade = user.grade;
          existingUser.damage = user.damage;
        }
      });

      loseTeam.forEach((user) => {
        const existingUser = loserInBattleLogs.find(
          (u) => u.nickname === user.nickname,
        );
        if (existingUser) {
          existingUser.assist = user.assist;
          existingUser.grade = user.grade;
          existingUser.damage = user.damage;
        }
      });
    });

    const refactoringData = matchListInfos.map((item, index) => {
      const {
        mapName,
        matchName,
        redClanName,
        redClanMark1,
        redClanMark2,
        blueClanName,
        blueClanMark1,
        blueClanMark2,
      } = item;

      if (matchDetails[index]['redResult'] === 'win') {
        const response = {
          matchKey: matchDetails[index]['matchKey'],
          matchTime: matchDetails[index]['matchTime'],
          mapName,
          matchName,
          plimit: '5vs5',
          redResult: matchDetails[index]['redResult'],
          redClanNo: matchDetails[index]['redClanNo'],
          redClanName,
          redClanMark1,
          redClanMark2,
          redUserList: battleLogs[index]['winnerTeam'],
          blueResult: matchDetails[index]['blueResult'],
          blueClanNo: matchDetails[index]['blueClanNo'],
          blueClanName,
          blueClanMark1,
          blueClanMark2,
          blueUserList: battleLogs[index]['loseTeam'],
        };

        return response;
      }

      const response = {
        matchKey: matchDetails[index]['matchKey'],
        matchTime: matchDetails[index]['matchTime'],
        mapName,
        matchName,
        plimit: '5vs5',
        blueResult: matchDetails[index]['blueResult'],
        blueClanNo: matchDetails[index]['blueClanNo'],
        blueClanName,
        blueClanMark1,
        blueClanMark2,
        blueUserList: battleLogs[index]['winnerTeam'],
        redResult: matchDetails[index]['redResult'],
        redClanNo: matchDetails[index]['redClanNo'],
        redClanName,
        redClanMark1,
        redClanMark2,
        redUserList: battleLogs[index]['loseTeam'],
      };
      return response;
    });

    return refactoringData;
  }

  refactoringBattleLogData(battleLogs: BattleLogs[][]): AllUserInMatch[] {
    const gameResults = [];

    battleLogs.forEach((battleLog) => {
      const result = {
        winnerTeam: [],
        loseTeam: [],
      };

      const winners = [];
      const losers = [];

      battleLog.forEach((event) => {
        const {
          weapon,
          userNexonSn,
          targetUserNexonSn,
          targetWeapon,
          winTeamUserNick,
          eventCategory,
          loseTeamUserNick,
          targetEventType,
        } = event;

        let winnerTeamUser = winners.find(
          (user) => user.nickname === winTeamUserNick,
        );
        if (!winnerTeamUser) {
          winnerTeamUser = {
            nickname: winTeamUserNick,
            userNexonSn,
            kill: 0,
            death: 0,
            assist: 0,
            damage: '0',
            grade: '',
            weapon: weapon === 'rifle' || weapon === 'sniper' ? weapon : null,
          };
          winners.push(winnerTeamUser);
        }

        let loseTeamUser = losers.find(
          (user) => user.nickname === loseTeamUserNick,
        );
        if (!loseTeamUser) {
          loseTeamUser = {
            nickname: loseTeamUserNick,
            userNexonSn: targetUserNexonSn,
            kill: 0,
            death: 0,
            assist: 0,
            damage: '0',
            grade: '',
            weapon:
              targetWeapon === 'rifle' || targetWeapon === 'sniper'
                ? targetWeapon
                : null,
          };
          losers.push(loseTeamUser);
        }

        if (eventCategory === 'kill') {
          winnerTeamUser.kill += 1;
        } else if (eventCategory === 'death') {
          winnerTeamUser.death += 1;
        } else if (eventCategory === 'assist') {
          winnerTeamUser.assist += 1;
        }

        if (targetEventType === 'kill') {
          loseTeamUser.kill += 1;
        } else if (targetEventType === 'death') {
          loseTeamUser.death += 1;
        }
      });

      result.winnerTeam = winners;
      result.loseTeam = losers;
      gameResults.push(result);
    });

    gameResults.filter((e) => e.winnerTeam.filter((t) => t.usernick !== null));

    return gameResults;
  }
}
