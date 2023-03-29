import { Inject, Injectable } from '@nestjs/common';
import { async } from 'rxjs';
import { NexonUserInsertDb } from 'src/commons/dto/nexon-user-info.dto/nexon-user-info.dto';
import { NEXON_USER_INFO } from 'src/core/constants';
import { NexonUserInfo } from './table/nexon-user-info.entitiy';

@Injectable()
export class NexonUserInfoRepository {
  constructor(
    @Inject(NEXON_USER_INFO)
    private nexonUserInfoModel: typeof NexonUserInfo,
  ) {}

  async findNexonUserInfos(allUserNexonSn: Array<number>) {
    const allUserNexon = await this.nexonUserInfoModel.findAll({
      where: {
        userNexonSn: allUserNexonSn,
      },
    });

    return allUserNexon;
  }

  async createAllNexonUser(userInfos: NexonUserInfo[]) {
    const insertUserInfoInDB = userInfos.map(
      async ({
        userNexonSn,
        ladderPoint,
        killPoint,
        deathPoint,
        totalWinningPoint,
        totalKd,
        kdRate,
        winCount,
        loseCount,
        winningRate,
      }) => {
        const createUsers = await this.nexonUserInfoModel.bulkCreate([
          {
            userNexonSn,
            ladderPoint,
            killPoint,
            deathPoint,
            totalKd,
            kdRate,
            winCount,
            loseCount,
            totalWinningPoint,
            winningRate,
          },
        ]);

        return createUsers;
      },
    );

    const response = await Promise.all(insertUserInfoInDB);
    const flatResponse = response.flat();
    return flatResponse;
  }

  async existsUsersUpdate(userInfos: NexonUserInfo[]) {
    const updateNexonUsers = userInfos.map(
      async ({
        ladderPoint,
        userNexonSn,
        killPoint,
        deathPoint,
        totalKd,
        kdRate,
        winCount,
        loseCount,
        totalWinningPoint,
        winningRate,
      }) => {
        const [numRows, [updatedUser]] = await this.nexonUserInfoModel.update(
          {
            ladderPoint,
            killPoint,
            deathPoint,
            totalKd,
            kdRate,
            winCount,
            loseCount,
            totalWinningPoint,
            winningRate,
          },
          {
            where: {
              userNexonSn,
            },
            returning: true,
          },
        );

        return updatedUser;
      },
    );

    const waitArray = await Promise.all(updateNexonUsers);

    return waitArray.flat();
  }

  async nexonUserRank() {
    return await this.nexonUserInfoModel.findAll({
      order: [['ladderPoint', 'DESC']],
      limit: 20,
    });
  }
}
