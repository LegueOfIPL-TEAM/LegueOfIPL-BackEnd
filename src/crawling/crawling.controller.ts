import { Controller, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('crawling')
export class CrawlingController {
    constructor(
        private crawlingService: CrawlingService
    ){}

    // @Get()
    // async test(){
    //     return await this.crawlingService.clanMatchData()
    // }

    @Get()
    async test(){
        return await this.crawlingService.clanMatchData()
    }
}
