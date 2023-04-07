import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlingModule } from 'src/crawling/crawling.module';
import { GameModule } from 'src/game/game.module';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [GameModule, CrawlingModule, ScheduleModule.forRoot()],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleCollectData {}
