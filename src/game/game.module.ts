import { Module } from '@nestjs/common';
import { ClanInfoModule } from 'src/clan-info/clan-info.module';
import { ClanMatchDetailModule } from 'src/clan-match-detail/clan-match-detail.module';
import { NexonUserBattleLogModule } from 'src/nexon-user-battle-log/nexon-user-battle-log.module';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { gameProviders } from './table/game.provider';

@Module({
  imports: [
    ClanInfoModule,
    NexonUserInfoModule,
    ClanMatchDetailModule,
    NexonUserBattleLogModule,
  ],
  controllers: [GameController],
  providers: [GameService, ...gameProviders, GameRepository],
})
export class GameModule {}
