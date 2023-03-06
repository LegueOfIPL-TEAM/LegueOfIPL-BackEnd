import { Inject, Injectable } from '@nestjs/common';
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

  async createAllNexonUser(userInfos: Array<number>) {
    const insertUserInfoInDB = userInfos.map(async (user) => {
      const createUsers = await this.nexonUserInfoModel.bulkCreate([
        {
          userNexonSn: user,
        },
      ]);

      return createUsers;
    });

    const response = Promise.all(insertUserInfoInDB);
    return response;
  }
}
