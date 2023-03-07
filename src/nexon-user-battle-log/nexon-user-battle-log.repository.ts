import { Inject, Injectable } from '@nestjs/common';
import { NEXON_USER_BATTLE_LOG } from 'src/core/constants';
import { NexonUserBattleLog } from './table/nexon-user-battle-log.entitiy';

@Injectable()
export class NexonUserBattleLogRepository {
  constructor(
    @Inject(NEXON_USER_BATTLE_LOG)
    private nexonUserBattleLogModel: NexonUserBattleLog,
  ) {}

  async createMatchDetailsWithClanId() {}
}
