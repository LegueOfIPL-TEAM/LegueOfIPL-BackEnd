import { Inject, Injectable } from '@nestjs/common';
import { NEXON_USER_INFO } from 'src/core/constants';
import { NexonUserInfo } from './table/nexon-user-info.entitiy';

@Injectable()
export class NexonUserInfoRepository {
  constructor(
    @Inject(NEXON_USER_INFO)
    private nexonUserMode: typeof NexonUserInfo,
  ) {}

  findNexonUserInfos(nexonSn: Array<string>) {
    const isExistsUser = this.nexonUserMode.findAll({
      where: {
        nexonUserInfo: nexonSn,
      },
    });

    return isExistsUser;
  }
}
