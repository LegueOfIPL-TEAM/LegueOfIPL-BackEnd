import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GameModule } from 'src/game/game.module';
import { CrawlingController } from './crawling.controller';
import { CrawlingRepository } from './crawling.repository';
import { CrawlingService } from './crawling.service';

@Module({
  imports: [HttpModule, GameModule],
  controllers: [CrawlingController],
  providers: [CrawlingService, CrawlingRepository],
  exports: [CrawlingService],
})
export class CrawlingModule {}
