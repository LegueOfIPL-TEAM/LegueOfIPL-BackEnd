import { Injectable } from '@nestjs/common';
import { CrawlingService } from 'src/crawling/crawling.service';
import { GameService } from 'src/game/game.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly crawlingService: CrawlingService,
    private readonly gameService: GameService,
  ) {}

  async collectDataInGameAndInsertDb() {
    const matchDetails = await this.crawlingService.allOfDatasInSa();
    await this.gameService.insertMatchData(matchDetails);
  }
}
