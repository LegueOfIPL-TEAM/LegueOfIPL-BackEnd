import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CrawlingService {
  async test() {

    
    const basicInfo = await this.getMatchList();

    const { battleLogUrls, matchResusltUrls, matchListInfo } = basicInfo
    
    const matchDetails = await this.getMatchDetails(matchResusltUrls)
    
    const battleLog = await this.getBattleLog(battleLogUrls)


    const allOfDataWithRefact = this.lastRefacDataOfSa({matchListInfo, battleLog, matchDetails})
    
    return battleLog
  }

  async getMatchDetails(urls) {
    const matchDetails = [];
  
    for (const [index, url] of urls.entries()) {
      const request = {
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/json' },
      };
  
      const requestSpecificUrl = await fetch(url, request);
      const response = await requestSpecificUrl.json();
  
      const { matchResultDataInfo, redUserList, blueUserList } = response;
      const { lose_team_name: loseTeamName, win_team_name: winTeamName, match_time: matchTime, blue_result: blueResult, red_result: redResult, blue_clan_no: blueClanNo, red_clan_no: redClanNo } = matchResultDataInfo;
      
      const returnValue = {
        blueResult,
        blueClanNo,
        redResult,
        redClanNo,
        winTeamName,
        loseTeamName,
        matchTime,
        redUserList: redUserList.map((user) => {
          const { nickname, kill, death, assist, damage } = user;

          const redUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
          };

          return redUserResponse
        }),
        blueUserList: blueUserList.map((user) => {
          const { nickname, kill, death, assist, damage } = user;

          const blueUserResponse = {
            nickname,
            kill,
            death,
            assist,
            damage,
          };

          return blueUserResponse
        })
      }
      matchDetails.push(returnValue);
    }
  
    return matchDetails;
  }
  

  async getBattleLog(urls) {
    const matchUserNick = [];
  
    const results = await Promise.all(
      urls.map(async (url) => {
        const request = {
          method: 'POST',
          url: url,
          headers: { 'Content-Type': 'application/json' },
        };
    
        const requestSpecificUrl = await fetch(url, request);
        const response = await requestSpecificUrl.json();
    
        const { battleLog } = response;
        
        const battleLogs = battleLog.map((values) => {
          const { user_nick:usernick, target_user_nick:targetUsernick, target_team_no:targetTeamNo, weapon, target_weapon:targetWeapon } = values
        
          if(targetTeamNo === 0){}
          const response = {
            winTeamUserNick: usernick,
            weapon,
            loseTeamUserNick: targetUsernick,
            targetWeapon,
          }

          return response
        }).filter((item, index, arr) => {
          return (
            index ===
            arr.findIndex((t) => 
            t.winTeamUserNick === item.winTeamUserNick &&
            t.loseTeamUserNick === item.loseTeamUserNick
            )
          );
        })
        
        return battleLogs;
        })
      );
    matchUserNick.push(...results);
    
    return matchUserNick
  }  

  async getMatchList (){
    const url = 'https://barracks.sa.nexon.com/api/ClanHome/GetClanMatchList/';

    const body = JSON.stringify({
      clan_id: 'tjrbdlf121122112',
    });

    const matchListRequest = {
      method: 'POST',
      url: url,
      body,
      headers: { 'Content-Type': 'application/json' },
    };

    const requestSpecificUrl = await fetch(url, matchListRequest);

    const response = await requestSpecificUrl.json();

    const { result } = response;

    

    const matchListInfo = [];
    const battleLogUrls = [];
    const matchResusltUrls = []
    const clanInIPLgue = [ 
    'NeGlecT-','Xperia','-Ballentine_s_M-','izmir-',`'Signal'`,'Asterisk','Entertainment、','decalcomanie:)','legend1st','Cherish*','ylevoL','deIuna','vuvuzela','Gloria','dokbul','레트로폭탄',
    'sugarcandy','savage..','♡starry','머리부시기','Bailey:','setter','GUlNNESS','wage','fierceness','MiraGe','saintlux','bellobro','surrealclan','<raiser>','sweetie','hypeus','Relive','everything',
    '♡idyllic','recent.wct','〃veritas','Critisism','massacre;','#Serious','none+', 'Mentalist:',
  ]
    result.forEach(item => {
      const {
        map_name: mapName,
        match_name: matchName,
        red_clan_name: redClanName,
        red_clan_mark1: redClanMark1,
        red_clan_mark2: redClanMark2,
        blue_clan_name: blueClanName,
        blue_clan_mark1: blueClanMark1,
        blue_clan_mark2: blueClanMark2,
        plimit,
        result_wdl:resulWdl,
        match_key: matchKey,
        clan_no: clanNo,
      } = item;

      if (mapName === '제3보급창고' && plimit === 5 && resulWdl === '승' && (clanInIPLgue.includes(blueClanName) && clanInIPLgue.includes(redClanName))  ){
        const returnValue = {
          mapName,
          matchName,
          redClanName,
          redClanMark1,
          redClanMark2,
          blueClanName,
          blueClanMark1,
          blueClanMark2,
          plimit,
        };
        const battleLogURL = `https://barracks.sa.nexon.com/api/BattleLog/GetBattleLogClan/${matchKey}/${clanNo}`;
        const matchResultUrl = `https://barracks.sa.nexon.com/api/Match/GetMatchClanDetail/${matchKey}/C/tjrbdlf121122112`
        battleLogUrls.push(battleLogURL);
        matchListInfo.push(returnValue);
        matchResusltUrls.push(matchResultUrl);
      } 
    });

    return { battleLogUrls, matchListInfo, matchResusltUrls };
  }

  lastRefacDataOfSa({matchListInfo, battleLog, matchDetails}){
    
    
    const test = matchListInfo.map((item, index) => {
      
      // match of list information
      const { 
        mapName,
        matchName,
        redClanName,
        redClanMark1,
        redClanMark2,
        blueClanName,
        blueClanMark1,
        blueClanMark2,
        plimit, 
      } = item      
      
      const response = {
        matchTime: matchDetails[index]['matchTime'],
        mapName,
        matchName,
        plimit: '5vs5',
        winTeamName: matchDetails[index]['winTeamName'],
        loseTeamName: matchDetails[index]['loseTeamName'],
        redClanName,
        redClanMark1,
        redClanMark2,
        redUserList: matchDetails[index]['redUserList'],
        blueClanMark1,
        blueClanMark2,
        blueClanName,
        blueUserList: matchDetails[index]['blueUserList'],
      }
      return response
    })
    return test
  }
}
