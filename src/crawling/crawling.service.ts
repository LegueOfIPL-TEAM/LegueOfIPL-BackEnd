import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { matchData } from 'src/commons/dto/cawling.dto';
import { chromium } from 'playwright'
import * as cheerio from 'cheerio'



@Injectable()
export class CrawlingService {
    constructor(
        private readonly httpService: HttpService
    ){}
    async playWrightCrawling(){
        const browser = await chromium.launch({
            headless: false,
            args: ['--disable-dev-shm-usage'],
          });
        
          const context = await browser.newContext({
            userAgent: "block"
          });
          const page = await context.newPage();
      
        // Load the page
        await page.goto("https://barracks.sa.nexon.com/clan/tjrbdlf121122112/clanMatch");
        
        const toggleElements = await page.$$(".accordion-toggle");

        for (const toggleButton of toggleElements) {
            await toggleButton.click();
        }
                
        const html = await page.content();

        const $ = cheerio.load(html);
        
        const data = $( `.accordion-detail`)
    
        let array = [];
        
        data.each((idx, node) => {
        
            array.push({
                "redClanName": $(node).find('div > div > div.result > div.result-ribbon.red > div.name.text-white.clan').text(),
                "blueClanName": $(node).find('div > div > div.result > div.result-ribbon.blue > div.name.text-white.clan').text(),
                "score": $(node).find('div > div > div.result > div.result-score > div.boundary > span.value.text-dark.Rajdhani').text(),
                "loseTeamInfo" : [
                    {
                        "nickName": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > a').text(),
                        "damage": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(9)').text(),
                        "kill": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
                    }
                ]
                
            })
        })

        
        
        //             $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(2) > td:nth-child(1) > div > a').text(),
        //             $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(3) > td:nth-child(1) > div > a').text(),
        //             $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(4) > td:nth-child(1) > div > a').text(),
        //             $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(5) > td:nth-child(1) > div > a').text()
        console.log(array)
        
        array.map((element) => {
            console.log(element.loseTeamInfo)
        })
        await browser.close();
    } 
    
      
    filteringClanInIpl(dataArray: Array<matchData>){
        const nameOfIplClan = [
        'NeGlecT-', 'Xperia', '-Ballentine_s_M-', 'izmir-', `'Signal'`, 'Asterisk', 'Entertainment、', 'decalcomanie:)', 'legend1st', 'Cherish*', 'ylevoL', 'deIuna', 'vuvuzela','Gloria',
        'dokbul', '레트로폭탄', 'sugarcandy', 'savage..', '♡starry', '머리부시기', 'Bailey:', 'setter', 'GUlNNESS', 'wage', 'fierceness', 'MiraGe', 'saintlux', 'bellobro', 'surrealclan',
        '<raiser>', 'sweetie', 'hypeus', 'Relive', 'everything', '♡idyllic', 'recent.wct', '〃veritas', 'Critisism', 'massacre;', '#Serious', 'none+'
        ]
    }

    // anotherWay(){

        // let specificUrls = []
          
        // page.on('request', request => {
        //   if (request.url().includes('https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/')) {
        //     const urls = request.url()
        //     specificUrls.push(urls)
        //   }
        // });  

    //     const saData = await page.evaluate(async () => {
    //         const response = await fetch('https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/230207180516124001/C/tjrbdlf121122112', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           },
    //         });
    //         return await response.json();
    //       });
          
    //       const { redUserList, matchResultDataInfo , blueUserList } = saData

    //       const { blue_clan_name:blueClanName, blue_result:blueResult, lose_team_name:loseTeamName, red_result:redResult, match_time:matchTime  } = matchResultDataInfo

    //       blueUserList.forEach((element) => {
    //         console.log(element.nickname)
    //       })

    //       const testData = {
    //         matchTime,
    //         blueClanName,
    //         blueResult,
    //         blueUserList,
    //         loseTeamName,
    //         redResult,
    //         redUserList,
    //       }
    // }
}
