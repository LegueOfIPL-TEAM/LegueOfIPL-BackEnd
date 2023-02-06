import { HttpException, Injectable } from '@nestjs/common';
// import {Builder, By, Key, until, Browser, CLASSNAME} from 'selenium-webdriver'
const {Builder, By, Key, until, time} = require('selenium-webdriver');
import { HttpService } from '@nestjs/axios'
import * as cheerio from 'cheerio'
import { matchData } from 'src/commons/dto/cawling.dto';
import { chromium } from 'playwright'


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
        // await page.waitForSelector("#clanMatch > div.grid > div.gd-1.grid-width-x3 > div.histories > div:nth-child(1) > div.accordion > a")
        
        // Find the hidden element
        const toggleElements = await page.$$(".accordion-toggle");

        for (const toggleButton of toggleElements) {
            await toggleButton.click();
          }

        // Make the hidden element visible
        // const element = await page.locator('#clanMatch > div.grid > div.gd-1.grid-width-x3 > div.histories > div:nth-child(1) > div.accordion-detail').evaluate(element => element.style.display = 'block');
        
        // Get the HTML content of the page
        const html = await page.content();

    
        // Load the HTML into Cheerio
        const $ = cheerio.load(html);
    
        // Extract the data from the visible element
        // const accordionDetail = $(`.accordion-detail`)
        
        
        // const listItems = await page.$$(
        //     `#clanMatch > div.grid > div.gd-1.grid-width-x3 > div.histories > div:nth-child(1) > div.accordion-detail > div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody`,
        // );

        // for (const item of listItems) {
        //     const text = await item.evaluate(node => 
        //         console.log(node.getAttributeNode('.first.highlight'))
        //     );
        //     console.log(text);
        // }
        
        const data = $( `.tbody`)
    
        let array = [];

        // #clanMatch > div.grid > div.gd-1.grid-width-x3 > div.histories > div:nth-child(2) > div.accordion-detail > div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr.first.highlight > td:nth-child(3)
        // #clanMatch > div.grid > div.gd-1.grid-width-x3 > div.histories > div:nth-child(2) > div.accordion-detail > div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(6) > td:nth-child(3)
        
        data.each((idx, node) => {
            
            // console.log($(node).text())
            const test = $(node).find('.data-v-56346afc').text()
            

            array.push({
                "test": [ test ]
            })
        })
        console.log(array)
        await browser.close();
    } 
      
    filteringClanInIpl(dataArray: Array<matchData>){
        const nameOfIplClan = [
        'NeGlecT-', 'Xperia', '-Ballentine_s_M-', 'izmir-', `'Signal'`, 'Asterisk', 'Entertainment、', 'decalcomanie:)', 'legend1st', 'Cherish*', 'ylevoL', 'deIuna', 'vuvuzela','Gloria',
        'dokbul', '레트로폭탄', 'sugarcandy', 'savage..', '♡starry', '머리부시기', 'Bailey:', 'setter', 'GUlNNESS', 'wage', 'fierceness', 'MiraGe', 'saintlux', 'bellobro', 'surrealclan',
        '<raiser>', 'sweetie', 'hypeus', 'Relive', 'everything', '♡idyllic', 'recent.wct', '〃veritas', 'Critisism', 'massacre;', '#Serious', 'none+'
        ]
    }
}
