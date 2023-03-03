import { HttpException, Injectable } from '@nestjs/common';
import { match } from 'assert';
import { CreateClanInfo } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { ClanInfoRepository } from './table/clan-info.repository';

@Injectable()
export class ClanInfoService {
  constructor(
    private readonly clanInfoRepository: ClanInfoRepository,
    private readonly nexonUserRepository: NexonUserInfoRepository,
  ) {}

  async createClanInfo(matchDetail: CreateClanInfo[]) {
    const response = matchDetail.map(async (matchInfos) => {
      const { redClanNo, blueClanNo, blueUserList, redUserList } = matchInfos;
      const clanNoArray = [redClanNo, blueClanNo];
      const match = [matchInfos];
      const blueUserNexonSn = blueUserList.map((user) => user.userNexonSn);
      const redUserNexonSn = redUserList.map((user) => user.userNexonSn);
      const allUserNexonSn = [blueUserNexonSn, redUserNexonSn];

      console.log(clanNoArray);
      console.log(allUserNexonSn);
      try {
        const findAllClanInfoByNos = await this.clanInfoRepository.findClanNos(
          clanNoArray,
        );

        // const isExistsNexonUser =
        //   await this.nexonUserRepository.findNexonUserInfos(allUserNexonSn);

        if (findAllClanInfoByNos.length === clanNoArray.length)
          return findAllClanInfoByNos.flat();

        const createClanInfos =
          await this.clanInfoRepository.createManyClanInfo(match);

        return createClanInfos;
      } catch (e) {
        throw new HttpException(e.message, 500);
      }
    });

    const results = await Promise.all(response);
    return results;
  }

  async updateClanLadder(clanMatchDetail: CreateClanInfo[]) {
    const response = clanMatchDetail.map(() => {});
  }
}
