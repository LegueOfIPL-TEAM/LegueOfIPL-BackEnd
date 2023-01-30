import { Module } from '@nestjs/common';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

@Module({
  controllers: [CrawlingController],
  providers: [CrawlingService]
})
export class CrawlingModule {}
