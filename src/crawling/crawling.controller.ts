import { Controller, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('crawling')
export class CrawlingController {
    constructor(
        private crawlingService: CrawlingService
    ){}
    // @Get()
    // async test2(){
    //     return await this.crawlingService.playWrightCrawling()
    // }

    @Get('/test')
    async test(){
        return await this.crawlingService.test()
    }
}
