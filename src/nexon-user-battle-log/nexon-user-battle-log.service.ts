import { Injectable } from '@nestjs/common';
import { MatchDetailsRefactToUserId } from 'src/commons/dto/nexon-user-battle-log.dto/nexon-user-battle-log.dto';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { NexonUserBattleLogRepository } from './nexon-user-battle-log.repository';

@Injectable()
export class NexonUserBattleLogService {
  constructor(
    private nexonUserBattleLogRepository: NexonUserBattleLogRepository,
    private nexonUserInfoRepository: NexonUserInfoRepository,
  ) {}
  async refactoringDataWithUserId({
    userNexonSns,
    nexonUsers,
    existsNexonUser,
  }: MatchDetailsRefactToUserId) {
    const matchLogWithWithUserId = nexonUsers.map((user) => {
      const {
        userNexonSn,
        nickname,
        kill,
        death,
        assist,
        damage,
        grade,
        weapon,
      } = user;

      return user;
      const matchingUser = existsNexonUser.find(
        (dataInDb) => dataInDb.userNexonSn === userNexonSn,
      );

      const response = {
        nickName: nickname,
        kill: kill,
        death: death,
        assist: assist,
        damage: damage,
        grade: grade,
        weapon: weapon,
        nexonUserId: matchingUser.id,
      };

      return response;
    });

    return matchLogWithWithUserId;
  }
}
