import { Module } from '@nestjs/common';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import { HttpModule } from '@nestjs/axios';
import { CrawlingRepository } from './crawling.repository';

@Module({
  imports: [HttpModule],
  controllers: [CrawlingController],
  providers: [CrawlingService, CrawlingRepository],
  exports: [CrawlingService],
})
export class CrawlingModule {}
