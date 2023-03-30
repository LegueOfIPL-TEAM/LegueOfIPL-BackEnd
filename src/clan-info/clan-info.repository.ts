import { Inject, Injectable } from '@nestjs/common';
import { CLAN_INFO } from 'src/core/constants';
import { ClanInfo } from './table/clan-info.entity';
import {
  MatchDetails,
  UpdateLadderPoint,
} from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { Sequelize } from 'sequelize';

@Injectable()
export class ClanInfoRepository {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
    @Inject(CLAN_INFO)
    private clanInfoEntitiy: typeof ClanInfo,
  ) {}

  async findClanNos(clanNo: Array<string>) {
    const findAllClanNos = await this.clanInfoEntitiy.findAll({
      where: {
        clanNo,
      },
    });

    return findAllClanNos;
  }

  async createManyClanInfoWithNexonUserInfo(matchDetails: MatchDetails[]) {
    const createManyClanInfo = matchDetails.map(async (matchData) => {
      const {
        redClanName,
        redClanNo,
        redClanMark1,
        redClanMark2,
        blueClanName,
        blueClanNo,
        blueClanMark1,
        blueClanMark2,
      } = matchData;

      const isertClanInfoWithNexonUserInfo =
        await this.clanInfoEntitiy.bulkCreate([
          {
            clanNo: redClanNo,
            clanName: redClanName,
            clanMark1: redClanMark1,
            clanMark2: redClanMark2,
          },
          {
            clanNo: blueClanNo,
            clanName: blueClanName,
            clanMark1: blueClanMark1,
            clanMark2: blueClanMark2,
          },
        ]);
      return isertClanInfoWithNexonUserInfo;
    });

    const response = await Promise.all(createManyClanInfo);

    return response.flat();
  }

  async createOnlyBlueClanInfo(matchDetails: MatchDetails[]) {
    const createManyClanInfo = matchDetails.map(async (matchData) => {
      const { blueClanName, blueClanNo, blueClanMark1, blueClanMark2 } =
        matchData;

      const isertClanInfo = await this.clanInfoEntitiy.bulkCreate([
        {
          clanNo: blueClanNo,
          clanName: blueClanName,
          clanMark1: blueClanMark1,
          clanMark2: blueClanMark2,
        },
      ]);
      return isertClanInfo;
    });
    const blueClanInfoList = await Promise.all(createManyClanInfo);
    const flattenedList = blueClanInfoList.flat();

    return flattenedList;
  }

  async createOnlyRedClanInfo(matchDetails: MatchDetails[]) {
    const createManyClanInfo = matchDetails.map(async (matchData) => {
      const { redClanNo, redClanName, redClanMark1, redClanMark2 } = matchData;

      const isertClanInfo = await this.clanInfoEntitiy.bulkCreate([
        {
          clanNo: redClanNo,
          clanName: redClanName,
          clanMark1: redClanMark1,
          clanMark2: redClanMark2,
        },
      ]);
      return isertClanInfo;
    });
    const redClanInfoList = await Promise.all(createManyClanInfo);
    const flattenedList = redClanInfoList.flat();

    return flattenedList;
  }

  async createClanInfoNoneDuplicate(
    matchClanDetails: ClanInfo[],
  ): Promise<ClanInfo[]> {
    const response = matchClanDetails.map(
      async ({
        clanNo,
        clanName,
        clanMark1,
        clanMark2,
        ladderPoint,
        winCount,
        loseCount,
        totalWinningPoint,
        winningRate,
      }) => {
        const createAllDataNotDuplicate = await this.clanInfoEntitiy.bulkCreate(
          [
            {
              clanNo,
              clanName,
              clanMark1,
              clanMark2,
              ladderPoint,
              winCount,
              loseCount,
              totalWinningPoint,
              winningRate,
            },
          ],
        );

        return createAllDataNotDuplicate;
      },
    );

    const waitArray = await Promise.all(response);
    const flatResponse = waitArray.flat();
    return flatResponse;
  }

  async updateClanLadder(updateInfo: ClanInfo[]) {
    const response = updateInfo.map(
      async ({
        id,
        ladderPoint,
        winCount,
        loseCount,
        totalWinningPoint,
        winningRate,
      }) => {
        const [num, [clanInfo]] = await this.clanInfoEntitiy.update(
          { ladderPoint, winCount, loseCount, totalWinningPoint, winningRate },
          {
            where: { id },
            returning: true,
          },
        );
        return clanInfo;
      },
    );

    const waitArray = await Promise.all(response);
    return waitArray.flat();
  }

  async findClanRank() {
    return await this.clanInfoEntitiy.findAll({
      order: [['ladderPoint', 'DESC']],
    });
  }
}
