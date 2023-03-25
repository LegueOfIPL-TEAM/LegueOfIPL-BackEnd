import { Inject, Injectable } from '@nestjs/common';
import { NexonUserBattleLogsInfo } from 'src/commons/dto/nexon-user-battle-log.dto/nexon-user-battle-log.dto';
import { NEXON_USER_BATTLE_LOG } from 'src/core/constants';
import { NexonUserBattleLog } from './table/nexon-user-battle-log.entitiy';

@Injectable()
export class NexonUserBattleLogRepository {
  constructor(
    @Inject(NEXON_USER_BATTLE_LOG)
    private nexonUserBattleLogModel: typeof NexonUserBattleLog,
  ) {}

  async createMatchDetailsWithUserId(
    userBattleLogs: NexonUserBattleLogsInfo[],
  ) {
    const response = userBattleLogs.map(
      async ({
        nickname,
        kill,
        death,
        assist,
        damage,
        grade,
        weapon,
        gameId,
        nexonUserId,
      }) => {
        const createBattleLog = await this.nexonUserBattleLogModel.bulkCreate([
          {
            nickname,
            kill,
            death,
            assist,
            damage:
              damage === '0' ? Number(damage) : Number(damage.replace(',', '')),
            grade: grade.trim() === '' ? null : grade.trim(),
            weapon,
            gameId,
            nexonUserId,
          },
        ]);
        return createBattleLog;
      },
    );

    const waitArray = await Promise.all(response);
    const flatResponse = waitArray.flat();

    return flatResponse;
  }
}
