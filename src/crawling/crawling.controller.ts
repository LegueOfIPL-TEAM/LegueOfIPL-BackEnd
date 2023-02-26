import { Controller, Get } from '@nestjs/common';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { CrawlingService } from './crawling.service';

@Controller('refactoring')
export class CrawlingController {
  constructor(private crawlingService: CrawlingService) {}
  @Get('/data')
  async crawlingAndRefactoringData(): Promise<AllOfDataAfterRefactoring[]> {
    return await this.crawlingService.allOfDatasInSa();
  }
}
