import { Controller, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
// : Promise<AllOfDataAfterRefactoring[]>
@Controller('refactoring')
export class CrawlingController {
  constructor(private crawlingService: CrawlingService) {}
  @Get('/data')
  async crawlingAndRefactoringData() {
    return await this.crawlingService.allOfDatasInSa();
  }
}
