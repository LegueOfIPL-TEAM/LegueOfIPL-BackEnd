import { HttpException, Injectable } from '@nestjs/common';
// import {Builder, By, Key, until, Browser, CLASSNAME} from 'selenium-webdriver'
const {Builder, By, Key, until, time} = require('selenium-webdriver');


@Injectable()
export class CrawlingService {
    
    async connection() {
        // Chrome 웹 드라이버 생성
        const driver = await new Builder().forBrowser('chrome').build()
        try {
            const url = "https://barracks.sa.nexon.com/clan/tjrbdlf121122112/clanMatch"

            // url 로딩
            await driver.get(url);

            
            // id 입력 
            const matchUp = await driver.findElements(By.css('div.accordion'))

            const array = [
                
            ]
            for( let i = 0; i < matchUp.length; i++){
                console.log(await matchUp[i].getText())
            }
    
    
        }catch(e){
            console.log(e.message)
        } finally{
            driver.quit()
        }
        
    }

    async example() {
        const driver = await new Builder().forBrowser('chrome').build();
        try {
          await driver.get('http://www.google.com/ncr');
          await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
          await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        } finally {
          await driver.quit();
        }
    }
}
