import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CLAN_INFO } from 'src/core/constants';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { ClanInfo } from './clan-info.entity';
import {
  CreateClanInfo,
  findManyclanNo,
} from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { UpdatedAt } from 'sequelize-typescript';
import { response } from 'express';

@Injectable()
export class ClanInfoRepository {
  constructor(
    @Inject(CLAN_INFO)
    private clanInfoEntitiy: typeof ClanInfo,
  ) {}

  async findExistsClanInRank(clanNo: number[]) {
    try {
      const isExistsClanInRank = await this.clanInfoEntitiy.findAll({
        where: {
          clanNo,
        },
      });

      if (isExistsClanInRank.length === clanNo.length)
        return isExistsClanInRank;

      const notExistsClanNo = isExistsClanInRank.map((source) => {
        for (let i = 0; i < clanNo.length; i++) {
          if (clanNo[i] === source.clanNo) {
            clanNo.splice(i, 1);
            i--;
          }
        }
      });

      return [...notExistsClanNo, ...isExistsClanInRank];
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async createClanInfo(matchDetail: CreateClanInfo[]) {
    const createManyClanInfo = matchDetail.map((matchData) => {
      const {
        redResult,
        redClanName,
        redClanNo,
        redClanMark1,
        redClanMark2,
        blueResult,
        blueClanName,
        blueClanNo,
        blueClanMark1,
        blueClanMark2,
      } = matchData;

      const numberOfRedNo = Number(redClanNo);
      const numberOfBlueNo = Number(blueClanNo);

      try {
        if (redResult === 'win') {
          const redClanInfoCreate = this.clanInfoEntitiy.bulkCreate([
            {
              clanNo: numberOfRedNo,
              clanName: redClanName,
              clanMark1: redClanMark1,
              clanMark2: redClanMark2,
              clanMatchDetail: [
                {
                  isRedTeam: true,
                  result: true,
                  targetTeamNo: blueClanNo,
                },
              ],
            },
            {
              clanNo: numberOfBlueNo,
              clanName: blueClanName,
              clanMark1: blueClanMark1,
              clanMark2: blueClanMark2,
              clanMatchDetail: [
                {
                  isblueTeama: true,
                  targetTeamNo: blueClanNo,
                },
              ],
            },
          ]);
          console.log(redClanInfoCreate);
          return redClanInfoCreate;
        }
      } catch (e) {
        throw new HttpException(e.message, 500);
      }
    });

    const response = await Promise.all(createManyClanInfo);

    return response;
  }
}
