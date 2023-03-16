import { Inject, Injectable } from '@nestjs/common';
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

  async createAllNexonUser(userInfos: NexonUserInsertDb[]) {
    const insertUserInfoInDB = userInfos.map(
      async ({ userNexonSn, ladderPoint }) => {
        const createUsers = await this.nexonUserInfoModel.bulkCreate([
          {
            userNexonSn,
            ladderPoint,
          },
        ]);

        return createUsers;
      },
    );

    const response = await Promise.all(insertUserInfoInDB);
    const flatResponse = response.flat();
    return flatResponse;
  }
}
