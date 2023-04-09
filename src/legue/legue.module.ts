import { Module } from '@nestjs/common';
import { ClanMatchDetailModule } from 'src/clan-match-detail/clan-match-detail.module';
import { NexonUserBattleLogModule } from 'src/nexon-user-battle-log/nexon-user-battle-log.module';
import { LegueController } from './legue.controller';
import { LegueService } from './legue.service';

@Module({
  imports: [NexonUserBattleLogModule, ClanMatchDetailModule],
  controllers: [LegueController],
  providers: [LegueService],
})
export class LegueModule {}
