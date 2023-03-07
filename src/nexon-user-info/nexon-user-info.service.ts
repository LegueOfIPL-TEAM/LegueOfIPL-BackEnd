import { HttpException, Injectable } from '@nestjs/common';
import { MatchDetails } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { OnlyMissingUser } from 'src/commons/dto/nexon-user-info.dto/nexon-user-info.dto';
import { NexonUserInfoRepository } from './nexon-user-info.repository';

@Injectable()
export class NexonUserInfoService {
  constructor(private nexonUserInfoRepository: NexonUserInfoRepository) {}
  async createUserInfo(matchDetails: MatchDetails[]) {
    const allUsersInfo = matchDetails
      .flatMap((match) => [match.redUserList, match.blueUserList])
      .flat();

    const allUserNexonSns = allUsersInfo.map((user) => user.userNexonSn);

    try {
      const findUserInDB =
        await this.nexonUserInfoRepository.findNexonUserInfos(allUserNexonSns);

      const onlyExistsSnInDB = findUserInDB.map((user) => user.userNexonSn);

      if (findUserInDB.length === 0) {
        const createUsers =
          await this.nexonUserInfoRepository.createAllNexonUser(
            allUserNexonSns,
          );
        return createUsers;
      } else if (allUserNexonSns.length > findUserInDB.length) {
        const insertMissingUser = await this.createOnlyMissingUsers({
          allUsersInfo,
          allUserNexonSns,
          onlyExistsSnInDB,
        });

        return insertMissingUser;
      } else if (findUserInDB.length === allUserNexonSns.length)
        return findUserInDB;
    } catch (e) {
      throw new HttpException(e.message, 500);
    }

    return allUserNexonSns;
  }

  async createOnlyMissingUsers(onlyMissingUserDTO: OnlyMissingUser) {
    const { allUsersInfo, allUserNexonSns, onlyExistsSnInDB } =
      onlyMissingUserDTO;

    const missingUserSns = allUserNexonSns.reduce((acc, match) => {
      if (!onlyExistsSnInDB.includes(match)) {
        acc.push(match);
      }
      return acc;
    }, []);

    const missingUserData = allUsersInfo.filter((match) => {
      return missingUserSns.includes(match.userNexonSn);
    });

    const missngUserNexonSns = missingUserData.map((user) => user.userNexonSn);

    const missingUserInsertDB =
      await this.nexonUserInfoRepository.createAllNexonUser(missngUserNexonSns);

    return missingUserInsertDB;
  }
}
