import { Module } from '@nestjs/common';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { NexonUserBattleLogController } from './nexon-user-battle-log.controller';
import { NexonUserBattleLogRepository } from './nexon-user-battle-log.repository';
import { NexonUserBattleLogService } from './nexon-user-battle-log.service';
import { nexonUserBattleLogProvider } from './table/nexon-user-battle-log.provider';

@Module({
  imports: [NexonUserInfoModule],
  controllers: [NexonUserBattleLogController],
  providers: [
    NexonUserBattleLogService,
    ...nexonUserBattleLogProvider,
    NexonUserBattleLogRepository,
  ],
  exports: [NexonUserBattleLogRepository, NexonUserBattleLogService],
})
export class NexonUserBattleLogModule {}
