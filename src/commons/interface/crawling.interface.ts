import { string } from 'joi';

export interface getManyMatchListAndUrls {
  battleLogUrls: string[];
  matchListInfo: matchListInfo[];
  matchResusltUrls: string[];
}

export interface getMatchDetails {
  blueResult: string;
  blueClanNo: string;
  redResult: string;
  redClanNo: string;
  winTeamName: string;
  loseTeamName: string;
  matchTime: Date;
  redUserList: Array<userList>;
  blueUserList: Array<userList>;
}

export interface userList {
  nickname: string;
  kill: number;
  death: number;
  assist: number;
  damage: number;
}

export interface matchListInfo {
  mapName: string;
  matchName: string;
  redClanName: string;
  redClanMark1: string;
  redClanMark2: string;
  blueClanName: string;
  blueClanMark1: string;
  blueClanMark2: string;
  plimit: number;
}
