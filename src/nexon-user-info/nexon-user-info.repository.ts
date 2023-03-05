import { Inject, Injectable } from '@nestjs/common';
import { NEXON_USER_INFO } from 'src/core/constants';
import { NexonUserInfo } from './table/nexon-user-info.entitiy';

@Injectable()
export class NexonUserInfoRepository {
  constructor(
    @Inject(NEXON_USER_INFO)
    private nexonUserInfoModel: typeof NexonUserInfo,
  ) {}

  async findNexonUserInfos(allUserNexonSn: Array<string>) {
    const allUserNexon = await this.nexonUserInfoModel.findAll({
      where: {
        userNexonSn: allUserNexonSn,
      },
    });

    return allUserNexon;
  }
}
