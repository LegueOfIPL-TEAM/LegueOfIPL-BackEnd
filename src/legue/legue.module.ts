import { Module } from '@nestjs/common';
import { ClanInfoModule } from 'src/clan-info/clan-info.module';
import { GameModule } from 'src/game/game.module';
import { LegueController } from './legue.controller';
import { LegueService } from './legue.service';

@Module({
  imports: [ClanInfoModule, GameModule],
  controllers: [LegueController],
  providers: [LegueService],
})
export class LegueModule {}
