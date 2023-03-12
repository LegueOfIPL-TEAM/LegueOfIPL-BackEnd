import { HttpException, Injectable } from '@nestjs/common';
import { match } from 'assert';
import { MatchDetails } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { ClanInfoRepository } from './clan-info.repository';

@Injectable()
export class ClanInfoService {
  constructor(
    private readonly clanInfoRepository: ClanInfoRepository,
    private readonly nexonUserRepository: NexonUserInfoRepository,
  ) {}

  async createClanInfo(matchDetails: MatchDetails[]) {
    const allClanNos = matchDetails.flatMap((matchData) => [
      matchData.redClanNo,
      matchData.blueClanNo,
    ]);

    try {
      const existsClan = await this.clanInfoRepository.findClanNos(allClanNos);

      const existsClanNos = existsClan.map((user) => user.clanNo);

      if (existsClan.length === 0) {
        //   주어진 데이터 속 어떠한 정보도 db에 존재하지 않는 경우
        const createAllData =
          await this.clanInfoRepository.createManyClanInfoWithNexonUserInfo(
            matchDetails,
          );

        return createAllData;
      } else if (existsClan.length !== allClanNos.length) {
        //   주어진 데이터 속 특정 clan이 db에 존재하지 않는 경우
        const createMissingClanInfo = await this.createMissingClanInfo(
          matchDetails,
          existsClanNos,
        );

        return createMissingClanInfo;
      } else if (existsClan.length === allClanNos.length) return existsClan;
    } catch (e) {
      throw new HttpException(e.message, 409);
    }
  }

  async createMissingClanInfo(
    matchDetails: MatchDetails[],
    existsClanNos: Array<string>,
  ) {
    const missingRedClan = matchDetails.reduce((acc, match) => {
      if (!existsClanNos.includes(match.redClanNo)) {
        acc.push(match.redClanNo);
      }
      return acc;
    }, []);

    const missingBlueClan = matchDetails.reduce((acc, match) => {
      if (!existsClanNos.includes(match.blueClanNo)) {
        acc.push(match.blueClanNo);
      }
      return acc;
    }, []);

    try {
      if (missingBlueClan.length > 0) {
        const missingBlueClandata = matchDetails.filter((match) => {
          return missingBlueClan.includes(match.blueClanNo);
        });

        const insertOnlyMissingBlueClan =
          await this.clanInfoRepository.createOnlyBlueClanInfo(
            missingBlueClandata,
          );

        return insertOnlyMissingBlueClan;
      }

      if (missingRedClan.length > 0) {
        const missingRedClandata = matchDetails.filter((match) => {
          return missingRedClan.includes(match.redClanNo);
        });

        const insertOnlyMissingRedClan =
          await this.clanInfoRepository.createOnlyRedClanInfo(
            missingRedClandata,
          );

        return insertOnlyMissingRedClan;
      }
    } catch (e) {
      throw new HttpException(e.message, 409);
    }
  }
}
