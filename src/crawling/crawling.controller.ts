import { Controller, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('refactoring')
export class CrawlingController {
    constructor(
        private crawlingService: CrawlingService
    ){}
    @Get('/data')
    async test(){
        return await this.crawlingService.allOfDatasInSa()
    }
}
