import { Module } from '@nestjs/common';
import { NexonUserBattleLogController } from './nexon-user-battle-log.controller';
import { NexonUserBattleLogService } from './nexon-user-battle-log.service';

@Module({
  controllers: [NexonUserBattleLogController],
  providers: [NexonUserBattleLogService]
})
export class NexonUserBattleLogModule {}
