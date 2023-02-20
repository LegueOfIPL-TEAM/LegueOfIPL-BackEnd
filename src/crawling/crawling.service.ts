import {
  Injectable,
} from '@nestjs/common';
import { response } from 'express';
import { getMatchDetailUrl } from 'src/commons/dto/cawling.dto';
import { enviroment } from 'src/commons/enviroment';
import { getManyMatchListAndUrls, getMatchDetails } from 'src/commons/interface/crawling.interface';
import * as inviroment from '../commons/enviroment'

@Injectable()
export class CrawlingService {
  async allOfDatasInSa() {
    const getMatchList = await this.getManyMatchList();

    const { battleLogUrls, matchListInfo, matchResusltUrls } = getMatchList

    const matchDetails = await this.getMatchDetails(matchResusltUrls)

    const battleLogs = await this.getBattleLog(battleLogUrls)

    const refacBattleLog = this.refactoringBattleLogData(battleLogs)

    const allOfDataWithRefact = this.lastRefacDataOfSa({matchListInfo, battleLogs: refacBattleLog, matchDetails})
  
    return allOfDataWithRefact
  }
  async getManyMatchList(): Promise<getManyMatchListAndUrls> {
    const url = enviroment.urlOfMatchList;

    const clienIds = enviroment.clienIds

    const matchListInfo = [];
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

      const clanInIPLgue = enviroment.clanNames

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
          const matchResultUrl = `https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/${matchKey}/C/${clienId}`
          
          battleLogUrls.push(battleLogURL);
          matchResusltUrls.push(matchResultUrl);
          matchListInfo.push(returnValue)
        }
      })
    }
    return { battleLogUrls, matchListInfo, matchResusltUrls}
  }

  async getMatchDetails(urls: string[]): Promise<getMatchDetails[]> {
    const matchDetails = [];
    for (const [index, url] of urls.entries()) {
      const request = {
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json' },
      };

      const requestSpecificUrl = await fetch(url, request);
      const response = await requestSpecificUrl.json();

      const { matchResultDataInfo, redUserList, blueUserList } = response;
      const {
        lose_team_name: loseTeamName,
        win_team_name: winTeamName,
        match_time: matchTime,
        blue_result: blueResult,
        red_result: redResult,
        blue_clan_no: blueClanNo,
        red_clan_no: redClanNo,
      } = matchResultDataInfo;

      const returnValue = {
        blueResult,
        blueClanNo,
        redResult,
        redClanNo,
        winTeamName,
        loseTeamName,
        matchTime,
        redUserList: redUserList.map((user) => {
          const { nickname, kill, death, assist, damage } = user;

          const redUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
          };
          return redUserResponse;
        }),
        blueUserList: blueUserList.map((user) => {
          const { nickname, kill, death, assist, damage } = user;

          const blueUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
          };
          return blueUserResponse;
        }),
      };
      matchDetails.push(returnValue);
    }

    return matchDetails;
  }

  async getBattleLog(urls) {
    const matchUserNick = [];

    const results = await Promise.all(
      urls.map(async (url) => {
        const request = {
          method: 'POST',
          url: url,
          headers: { 'Content-Type': 'application/json' },
        };

        const requestSpecificUrl = await fetch(url, request);
        
        if(requestSpecificUrl.status === 500) return []
        
        const response = await requestSpecificUrl.json();
        

        const { battleLog } = response;

        const battleLogs = battleLog.map((values, index) => {
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
            targetTeamNo === 0 &&
            ((eventCategory || targetEventType) === 'bomb' || 'mission')
          ) {
          }

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
        });

        return battleLogs;
      }),
    );
    matchUserNick.push(...results);

    return matchUserNick;
  }



  lastRefacDataOfSa({ matchListInfo, battleLogs, matchDetails }) {
    matchDetails.forEach((match) => {
      const { blueResult, redResult, blueUserList, redUserList } = match;
      console.log(blueResult)
      const winnerTeam = blueResult === "win" ? blueUserList : redUserList;
      const loseTeam = blueResult === "lose" ? blueUserList : redUserList;
  
      
      // winnerTeam과 loseTeam의 유저 정보를 matchDetails의 정보로 갱신
      winnerTeam.forEach((user) => {
        const existingUser = battleLogs.find((u) => u.nickname === user.nickname);
        if (existingUser) {
          user.damage = existingUser.damage;
        }
      });
      loseTeam.forEach((user) => {
        const existingUser = battleLogs.find((u) => u.nickname === user.nickname);
        if (existingUser) {
          user.damage = existingUser.damage;
        }
      });
  
      // matchDetails에 포함되지 않은 유저 정보를 arr에서 찾아 삽입
      battleLogs.forEach((user) => {
        const isUserInMatch = [...blueUserList, ...redUserList].some(
          (u) => u.nickname === user.nickname
        );
        if (!isUserInMatch) {
          const newUser = {
            nickname: user.nickname,
            kill: 0,
            death: 0,
            assist: 0,
            damage: user.damage,
          };
          if (winnerTeam.some((u) => u.nickname === user.nickname)) {
            const existingUser = winnerTeam.find(
              (u) => u.nickname === user.nickname
            );
            newUser.kill = existingUser.kill;
            newUser.death = existingUser.death;
            newUser.assist = existingUser.assist;
            user.damage = existingUser.damage;
          } else if (loseTeam.some((u) => u.nickname === user.nickname)) {
            const existingUser = loseTeam.find(
              (u) => u.nickname === user.nickname
            );
            newUser.kill = existingUser.kill;
            newUser.death = existingUser.death;
            newUser.assist = existingUser.assist;
            user.damage = existingUser.damage;
          }
          if (newUser.nickname) {
            if (newUser.nickname[0] === "[") {
              winnerTeam.unshift(newUser);
            } else {
              loseTeam.unshift(newUser);
            }
          }
          match.blueUserList = blueUserList;
          match.redUserList = redUserList;
        }
      });
    });
  
    // arr 배열을 갱신
    battleLogs.forEach((user) => {
      const matchingUser = [...matchDetails.flatMap(match => match.blueUserList), ...matchDetails.flatMap(match => match.redUserList)].find(
        (u) => u.nickname === user.nickname
      );
      if (matchingUser) {
        user.damage = matchingUser.damage;
      }

    });

    return battleLogs
      // const blueWinResult = {
      //   matchListInfo: matchListInfo[index],
      //   winnerTeam: {
      //     winnerTeam,
      //     damage: matchDetails[index]
      //   }
      // }
      
      // return blueWinResult
    
    // const refactoringData = matchListInfo.map((item, index) => {
    //   const {
    //     mapName,
    //     matchName,
    //     redClanName,
    //     redClanMark1,
    //     redClanMark2,
    //     blueClanName,
    //     blueClanMark1,
    //     blueClanMark2,
    //   } = item;

    //   if (matchDetails[index]['redResult'] === 'win') {
    //     const response = {
    //       matchTime: matchDetails[index]['matchTime'],
    //       mapName,
    //       matchName,
    //       plimit: '5vs5',
    //       winTeamName: matchDetails[index]['winTeamName'],
    //       loseTeamName: matchDetails[index]['loseTeamName'],
    //       redClanName,
    //       redClanMark1,
    //       redClanMark2,
    //       redUserList: battleLogs[index]['winnerTeam'],
    //       blueClanMark1,
    //       blueClanMark2,
    //       blueClanName,
    //       blueUserList: battleLogs[index]['loseTeam'], 
    //     };

    //     return response;
    //   }

    //   const response = {
    //     matchTime: matchDetails[index]['matchTime'],
    //     mapName,
    //     matchName,
    //     plimit: '5vs5',
    //     winTeamName: matchDetails[index]['winTeamName'],
    //     loseTeamName: matchDetails[index]['loseTeamName'],
    //     redClanName,
    //     redClanMark1,
    //     redClanMark2,
    //     redUserList: battleLogs[index]['loseTeam'],
    //     blueClanMark1,
    //     blueClanMark2,
    //     blueClanName,
    //     blueUserList: battleLogs[index]['winnerTeam'],
    //   };

  

    //   return response;
    // });
  }

  refactoringBattleLogData(battleLogs) {
    const gameResults = [];

    battleLogs.forEach((battleLog) => {
      const winnerTeam = {};
      const loseTeam = {};

      battleLog.forEach((event) => {
        const {
          weapon,
          userNexonSn,
          targetUserNexonSn,
          targetWeapon,
          winTeamUserNick,
          eventCategory,
          loseTeamUserNick,
        } = event;

        if (!winnerTeam[winTeamUserNick]) {
          winnerTeam[winTeamUserNick] = {
            userNexonSn,
            kill: 0,
            death: 0,
            assist: 0,
            weapon: weapon === 'rifle' || weapon === 'sniper' ? weapon : null,
          }
        }
      
        if (eventCategory === 'kill') {
          winnerTeam[event.winTeamUserNick].kill += 1;
        } else if (eventCategory === 'death') {
          winnerTeam[event.winTeamUserNick].death += 1;
        }

        if (!loseTeam[loseTeamUserNick]) {
          loseTeam[loseTeamUserNick] = {
            targetUserNexonSn,
            kill: 0,
            death: 0,
            assist: 0,
            weapon:
              targetWeapon === 'rifle' || targetWeapon === 'sniper'
                ? targetWeapon
                : null,
          };
        }

        if (event.targetEventType === 'kill') {
          loseTeam[loseTeamUserNick].kill += 1;
        } else if (event.targetEventType === 'death') {
          loseTeam[loseTeamUserNick].death += 1;
        }
      });

      gameResults.push(winnerTeam, loseTeam);
    });
    return gameResults;
  }
}
