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
        
        const context = await browser.newContext({});
        const page = await context.newPage();

        let specificUrls = []
        let battleLogUrls = []
        page.on('request', request => {
          if (request.url().includes('https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/')) {
            const urls = request.url()
            specificUrls.push(urls)
          }else if (request.url().includes(`https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/`)){
            const urls = request.url()
            battleLogUrls.push(urls)
        }
        });  
      
        // Load the page
        await page.goto("https://barracks.sa.nexon.com/clan/tjrbdlf121122112/clanMatch");
        
        const toggleElements = await page.$$(".accordion-toggle");

        for (const toggleButton of toggleElements) {
            await toggleButton.click();
        }

        await browser.close();

        let SA = []

        let battleLog = []

        for (const url of specificUrls) {
            const request = {
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
            };
         
            const requestSpecificUrl = await fetch(url, request)
            
            const response = await requestSpecificUrl.json()

            SA.push(response)
        }

        console.log(battleLogUrls)
       for( const url of battleLogUrls) {
            const request = {
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json' },
            };
            console.log(url)

            const requestSpecificUrl = await fetch(url, request)


            const response = await requestSpecificUrl.json()
       }

       

        
        const refacDataOfSA = SA.map((node, idx) => {
            
            const battle = battleLog.map((battleInfo, idx) => {
                const { battleLog } = battleInfo
                const test = battleLog.map((node) => {
                    const { target_user_nick } = node
                    const { user_nick } = node

                    const response = {
                        targetUserNick: target_user_nick,
                        userNick: user_nick ,
                    }

                    
                    return response
                })
                
                const initialValue = []
                let targetUserNickArray = test.map(obj => obj.targetUserNick).reduce((acc, obj) => acc.includes(obj) ? acc : [...acc, obj], initialValue)
                let userNickArray = test.map(obj => obj.userNick).reduce((acc, obj) => acc.includes(obj) ? acc : [...acc, obj], initialValue)

                const response = {
                    targetUserNickArray,
                    userNickArray
                }
                
                console.log(response)
                return response
            })

            
            
            const { matchResultDataInfo, redUserList, blueUserList, userbattleInfo } = node
            const {
                red_result: redResult, blue_result: blueResult, blue_clan_name:blueClanName, red_clan_name: redClanName, blue_clan_img1:blueClanOutCircleImg, blue_clan_img1: blueClanInCircleImg,
                red_clan_img1: redClanOutCircleImg, red_clan_img1: redClanInCircleImg, blue_win_cnt: blueWinCnt, red_win_cnt:redWinCnt, match_time:matchTime, match_type:matchType
            } = matchResultDataInfo
            
            
            const detailOfMatch = userbattleInfo.map((matchDetail, idx) => {
                const { user_battle_info:userBattleDetail } = matchDetail
                const parsingData = JSON.parse(userBattleDetail)
                const { MatchData:matchData } = parsingData
                const { M_PLAYER_plimit:numberOfMatchUsers, M_PLAYER_map_no:mapNo  } = matchData
                
                const dataOfMatch = {
                    numberOfMatchUsers,
                    mapNo
                }

                if(dataOfMatch.numberOfMatchUsers === 5){
                    const response = {
                        numberOfMatchUsers: '5vs5',
                        mapNo: '제3보급창고'
                    }
                    
                    return response
                }
            }).filter((item) => item !== undefined)

            const response = {
                matchTime,
                matchType,
                detailOfMatch: detailOfMatch[0],
                blueResult, 
                blueWinCnt,
                blueClanOutCircleImg,
                blueClanInCircleImg,
                blueClanName,
                blueUserList: blueUserList.map((user) => {
                    const { nickname, kill, death, assist, damage, grademark } = user

                    const blueUserResponse = {
                        grademark,
                        nickname,
                        kda: `${kill}/${death}/${assist}`,
                        damage,
                    }
                    return blueUserResponse
                }),
                redResult,
                redWinCnt,
                redClanOutCircleImg,
                redClanInCircleImg,
                redClanName,
                redUserList: redUserList.map((user) => {
                    const { nickname, kill, death, assist, damage } = user

                    const blueUserResponse = {
                        nickname,
                        kda: `${kill}/${death}/${assist}`,
                        damage,
                    }
                    return blueUserResponse
                }),
            }
        return response
        })
    } 
    
      
    filteringClanInIpl(dataArray: Array<matchData>){
        const nameOfIplClan = [
            'NeGlecT-', 'Xperia', '-Ballentine_s_M-', 'izmir-', `'Signal'`, 'Asterisk', 'Entertainment、', 'decalcomanie:)', 'legend1st', 'Cherish*', 'ylevoL', 'deIuna', 'vuvuzela','Gloria',
            'dokbul', '레트로폭탄', 'sugarcandy', 'savage..', '♡starry', '머리부시기', 'Bailey:', 'setter', 'GUlNNESS', 'wage', 'fierceness', 'MiraGe', 'saintlux', 'bellobro', 'surrealclan',
            '<raiser>', 'sweetie', 'hypeus', 'Relive', 'everything', '♡idyllic', 'recent.wct', '〃veritas', 'Critisism', 'massacre;', '#Serious', 'none+'
        ]   
    }

    async testAPI(){
        const browser = await chromium.launch({
            headless: false,
            args: ['--disable-dev-shm-usage'],
            });
        
        const context = await browser.newContext({});
        const page = await context.newPage();

        let specificUrls = []
        let battleLogUrls = []
        
        page.on('request', request => {
            if (request.url().includes('https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/')){
                const urls = request.url()
                specificUrls.push(urls)
            } else if (request.url().includes(`https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/`)){
                const urls = request.url()
                battleLogUrls.push(urls)
            }
        });  
        
        // Load the page
        await page.goto("https://barracks.sa.nexon.com/clan/tjrbdlf121122112/clanMatch");
        
        const toggleElements = await page.$$(".accordion-toggle");

        for (const toggleButton of toggleElements) {
            await toggleButton.click();
        }
        
        await browser.close();

        let SA = []

        const request = {
            method: 'POST',
            url: 'https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/230209193900124001/210427000335',
            headers: { 'Content-Type': 'application/json' },
        };

        const requestSpecificUrl = await fetch('https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/230209193900124001/210427000335', request)

        const response = await requestSpecificUrl.json()

        SA.push(response)

        console.log(SA)
    }

    // anotherWay(){
            // const saData = await page.evaluate(async () => {
            
        //     const response = await fetch('https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/230207180516124001/C/tjrbdlf121122112', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json'
        //       },
        //     });
        //     return await response.json();
        // });


                
        // const html = await page.content();

        // const $ = cheerio.load(html);
        
        // const data = $( `.accordion-detail`)
    
        // let array = [];
        
        // data.each((idx, node) => {
        //     array.push({
        //         "redClanName": $(node).find('div > div > div.result > div.result-ribbon.red > div.name.text-white.clan').text(),
        //         "blueClanName": $(node).find('div > div > div.result > div.result-ribbon.blue > div.name.text-white.clan').text(),
        //         "score": $(node).find('div > div > div.result > div.result-score > div.boundary > span.value.text-dark.Rajdhani').text(),
        //         "loseTeamInfo" : [
        //             {
        //                 "nickName": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(3) > div > a').text(),
        //                 "damage": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(9)').text(),
        //                 "kill": $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
        //                 $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(2) > td:nth-child(1) > div > a').text(),
        //                 $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(3) > td:nth-child(1) > div > a').text(),
        //                 $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(4) > td:nth-child(1) > div > a').text(),
        //                 $(node).find('div > div > div.history-tab > div.tabs-details > div:nth-child(1) > div > div.tbody > table > tbody > tr:nth-child(5) > td:nth-child(1) > div > a').text()
        //             }
        //         ]
                
        //     })
        // })        
        
        
          
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
