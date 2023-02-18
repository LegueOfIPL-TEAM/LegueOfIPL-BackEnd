import { Module } from '@nestjs/common';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [CrawlingController],
  providers: [CrawlingService]
})
export class CrawlingModule {}
