import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameRepository } from './game.repository';
import { GameService } from './game.service';
import { gameProviders } from './table/game.provider';

@Module({
  controllers: [GameController],
  providers: [GameService, ...gameProviders, GameRepository],
})
export class GameModule {}
