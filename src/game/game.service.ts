import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoService } from 'src/clan-info/clan-info.service';
import { ClanInfoRepository } from 'src/clan-info/table/clan-info.repository';
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

@Injectable()
export class GameService {
  constructor(
    private gameRepository: GameRepository,
    private clanInfoService: ClanInfoService,
    private clanInfoRepository: ClanInfoRepository,
    private nexonUserBattleLogService: NexonUserBattleLogService,
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

    // return allClanInfo;

    try {
      const existsGameInfo = await this.gameRepository.insertMatchData(
        gameInfo,
      );

      const isertAnyNoneData = await this.insertAnyNonExistsData({
        existsGameInfo,
        nexonUserDetails: nexonUsers,
        matchClanDetails: allClanInfo,
      });

      return isertAnyNoneData;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async insertAnyNonExistsData({
    existsGameInfo,
    nexonUserDetails,
    matchClanDetails,
  }: InsertAnyNoneData) {
    const nonDuplicateClanInfos = matchClanDetails.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.clanNo === item.clanNo);
      if (!existingItem) {
        acc.push({
          clanName: item.clanName,
          clanNo: item.clanNo,
          clanMark1: item.clanMark1,
          clanMark2: item.clanMark2,
        });
      }
      return acc;
    }, []);

    const clanInfos = await this.clanInfoRepository.createClanInfoNoneDuplicate(
      nonDuplicateClanInfos,
    );

    const gameMatchDetails = matchClanDetails.reduce((acc, item) => {
      const gameInfos = existsGameInfo.find(
        (i) => i.matchKey === item.matchKey,
      );

      const ourClanInfo = clanInfos.find((i) => i.clanNo === item.clanNo);

      if (existsGameInfo) {
        acc.push({
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
      return acc;
    }, []);

    const matchResults =
      await this.clanMatchDetailRepository.createClanMatchDetail(
        gameMatchDetails,
      );

    return matchResults;
  }
}
