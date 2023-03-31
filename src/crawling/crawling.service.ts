import { HttpException, Injectable } from '@nestjs/common';
import {
  AllOfDataBeforRefactoring,
  BattleLogs,
} from 'src/commons/dto/crawling.dto/cawling.dto';
import { enviroment } from 'src/commons/enviroment';
import {
  AllOfDataAfterRefactoring,
  AllUserInMatch,
  GameLogs,
  getManyMatchListAndUrls,
} from 'src/commons/interface/crawling.interface';
import { GameRepository } from 'src/game/game.repository';

@Injectable()
export class CrawlingService {
  constructor(private gameRepository: GameRepository) {}
  async allOfDatasInSa(): Promise<AllOfDataAfterRefactoring[]> {
    const getMatchList = await this.getMatchList();

    const { battleLogUrls, matchListInfos, matchResultUrls } = getMatchList;

    const matchDetails = await this.getMatchDetails(matchResultUrls);

    const battleLogs = await this.getBattleLog(battleLogUrls);

    const refactBattleLog = this.refactoredBattleLogData(battleLogs);

    const allOfDataWithRefact = this.collectDataOfSa({
      matchListInfos,
      battleLogs: refactBattleLog,
      matchDetails,
    });

    return allOfDataWithRefact;
  }

  async getMatchList(): Promise<getManyMatchListAndUrls> {
    const clanInIPLgue = enviroment.clanNames;
    const url = enviroment.urlOfMatchList;
    const clienIds = enviroment.clienIds;
    const matchListInfos = [];
    const battleLogUrls = [];
    const matchResultUrls = [];

    const requests = clienIds.map((clienId) => {
      const body = JSON.stringify({
        clan_id: clienId,
      });

      const matchListRequest = {
        method: 'POST',
        url: url,
        body,
        headers: { 'Content-Type': 'application/json' },
      };

      return fetch(url, matchListRequest)
        .then((response) => response.json())
        .then((json) => ({ clienId, result: json.result }))
        .catch((error) => {
          throw new HttpException(error.message, 500);
        });
    });
    const results = await Promise.all(requests);

    for (const { clienId, result } of results) {
      try {
        for (const item of result) {
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

          const matchKeyExists = await this.gameRepository.findByMatchKey(
            matchKey,
          );

          if (
            !matchKeyExists &&
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
            matchResultUrls.push(matchResultUrl);
            matchListInfos.push(returnValue);
          }
        }
        return { battleLogUrls, matchResultUrls, matchListInfos };
      } catch (e) {
        throw new HttpException(e.message, 500);
      }
    }
  }

  async getMatchDetails(urls: string[]) {
    const requests = urls.map((url) => ({
      method: 'POST',
      url,
      headers: { 'Content-Type': 'application/json' },
    }));

    const responses = await Promise.all(
      requests.map((request) => fetch(request.url, request)),
    );
    const matchDetails = await Promise.all(
      responses.map((response) => response.json()),
    );

    return matchDetails.map(
      ({ matchResultDataInfo, redUserList, blueUserList, myMatchRating }) => {
        const {
          lose_team_name,
          win_team_name,
          match_time,
          blue_result,
          red_result,
          blue_clan_no,
          red_clan_no,
        } = matchResultDataInfo;
        const { match_key } = myMatchRating;

        return {
          matchKey: match_key,
          blueResult: blue_result,
          blueClanNo: blue_clan_no,
          redResult: red_result,
          redClanNo: red_clan_no,
          winTeamName: win_team_name,
          loseTeamName: lose_team_name,
          matchTime: match_time,
          redUserList: redUserList.map(
            ({ nickname, kill, death, assist, damage, grade }) => ({
              nickname,
              kill,
              death,
              assist,
              damage,
              grade,
            }),
          ),
          blueUserList: blueUserList.map(
            ({ nickname, kill, death, assist, damage, grade }) => ({
              nickname,
              kill,
              death,
              assist,
              damage,
              grade,
            }),
          ),
        };
      },
    );
  }

  async getBattleLog(urls: string[]): Promise<GameLogs> {
    const userBattleLog = [];

    for (const url of urls) {
      const request = {
        method: 'POST',
        url,
        headers: { 'Content-Type': 'application/json' },
      };

      const requestSpecificUrl = await fetch(url, request);

      if (requestSpecificUrl.status === 500) continue;

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

      userBattleLog.push(...battleLogs.filter((obj) => obj !== undefined));
    }

    return userBattleLog;
  }

  collectDataOfSa({
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

  refactoredBattleLogData(battleLogs: BattleLogs[]): AllUserInMatch[] {
    const gameResults = [];
    const result = {
      winnerTeam: [],
      loseTeam: [],
    };
    const winners = [];
    const losers = [];

    battleLogs.forEach((event) => {
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

    return gameResults;
  }
}
