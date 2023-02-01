import { HttpException, Injectable } from '@nestjs/common';
// import {Builder, By, Key, until, Browser, CLASSNAME} from 'selenium-webdriver'
const {Builder, By, Key, until, time} = require('selenium-webdriver');
import { HttpService } from '@nestjs/axios'
import * as cheerio from 'cheerio'
import { matchData } from 'src/commons/dto/cawling.dto';


@Injectable()
export class CrawlingService {
    constructor(
        private readonly httpService: HttpService
    ){}
    async clanMatchData() {
        // Chrome 웹 드라이버 생성
        const driver = await new Builder().forBrowser('chrome').build()

        let gridArray = []
       
        try {
            const array = ['sugarcandy', 'Envy']

            const url = "https://barracks.sa.nexon.com/clan/tjrbdlf121122112/clanMatch"

            await driver.get(url);

            const saData = await driver.getPageSource();

            const $ = cheerio.load(saData);
            
            // const matchList = $('.accordion')

            // const findElement = (node, element) => {
            //     return $(node).find(`${element}`).text()
            // }
            
            // matchList.each((idx, node ) => {
            //     // console.log($(node).text())
            //     matchDataArray.push({
            //         "matchTime": findElement(node, '.date.dotum'),
            //         "clan": findElement(node, '.nickname'),
            //         "Map": findElement(node, 'ul > li:nth-child(2)'),
            //         "score": findElement(node, '.versus.Rajdhani'),
            //         "mathType": findElement(node, '.line-break'),
            //     })
            // })

            let matchDataArray = []

            console.log('start To toggle up')
            const toggle = await driver.findElement(By.className('accordion-toggle'))
            await toggle.click();
            console.log('end to toggle up')
            

            let toggleData = $( ".histroy-detail" ).text();
            console.log(toggleData)
            console.log('hi')


            const matchData = $('.history-detail')

            matchData.each((idx, node) => {
                console.log('this')
                console.log($(node).text())
            })

            
        }catch(e){
            console.log(e.message)
        } 
    }
      
    filteringClanInIpl(dataArray: Array<matchData>){
        const nameOfIplClan = [
        'NeGlecT-', 'Xperia', '-Ballentine_s_M-', 'izmir-', `'Signal'`, 'Asterisk', 'Entertainment、', 'decalcomanie:)', 'legend1st', 'Cherish*', 'ylevoL', 'deIuna', 'vuvuzela','Gloria',
        'dokbul', '레트로폭탄', 'sugarcandy', 'savage..', '♡starry', '머리부시기', 'Bailey:', 'setter', 'GUlNNESS', 'wage', 'fierceness', 'MiraGe', 'saintlux', 'bellobro', 'surrealclan',
        '<raiser>', 'sweetie', 'hypeus', 'Relive', 'everything', '♡idyllic', 'recent.wct', '〃veritas', 'Critisism', 'massacre;', '#Serious', 'none+'
        ]
    }
}
