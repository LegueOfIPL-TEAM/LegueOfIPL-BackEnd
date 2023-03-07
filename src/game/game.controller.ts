import { Body, Controller, Post } from '@nestjs/common';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  async insertMatchDataInDatabase(
    @Body() matchData: AllOfDataAfterRefactoring[],
  ) {
    return await this.gameService.insertMatchData(matchData);
  }
}
