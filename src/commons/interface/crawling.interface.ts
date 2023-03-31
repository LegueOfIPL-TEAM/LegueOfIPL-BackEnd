import { NexonUserBattleLog } from 'src/nexon-user-battle-log/table/nexon-user-battle-log.entitiy';

export interface AllOfDataAfterRefactoring {
  matchKey: string;
  matchTime: string;
  redResult: string;
  redClanNo: string;
  redClanName: string;
  redClanMark1: string;
  redClanMark2: string;
  redUserList: Player[];
  blueResult: string;
  blueClanNo: string;
  blueClanName: string;
  blueClanMark1: string;
  blueClanMark2: string;
  blueUserList: Player[];
}

export interface getManyMatchListAndUrls {
  matchListInfos: MatchListInfo[];
  battleLogUrls: string[];
  matchResultUrls: string[];
}

export interface getMatchDetails {
  blueResult: string;
  blueClanNo: string;
  redResult: string;
  redClanNo: string;
  winTeamName: string;
  loseTeamName: string;
  matchTime: Date;
  redUserList: userList[];
  blueUserList: userList[];
}

export type userList = Omit<Player, 'userNexonSn' | 'weapon'>;

export interface MatchListInfo {
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

export interface KillLog {
  winTeamUserNick: string;
  eventCategory: string;
  userNexonSn: number;
  weapon: string;
  loseTeamUserNick: string;
  targetEventType: string;
  targetUserNexonSn: number;
  targetWeapon: string;
}

export type GameLogs = KillLog[];

export interface AllUserInMatch {
  winnerTeam: Player[];
  loseTeam: Player[];
}
export interface Player {
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: string;
  grade: string;
  weapon: string;
}

export interface TeamResults {
  winnerTeam: NexonUserBattleLog[];
  loserTeam: NexonUserBattleLog[];
}
