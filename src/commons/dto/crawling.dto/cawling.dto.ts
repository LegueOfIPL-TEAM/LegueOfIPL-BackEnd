export class AllOfDataBeforRefactoring {
  matchListInfos: MatchListInfo[];
  battleLogs: FirstRefactoringBattleLogs[];
  matchDetails: getMatchDetails[];
}

export class FirstRefactoringBattleLogs {
  winnerTeam: UserList[];
  loseTeam: UserList[];
}
export class getMatchDetails {
  matchKey: string;
  blueResult: string;
  blueClanNo: string;
  redResult: string;
  redClanNo: string;
  winTeamName: string;
  loseTeamName: string;
  matchTime: Date;
  redUserList: Players[];
  blueUserList: Players[];
}

export class MatchListInfo {
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

export class BattleLogs {
  winTeamUserNick: string;
  eventCategory: string;
  userNexonSn: number;
  weapon: string;
  loseTeamUserNick: string;
  targetEventType: string;
  targetUserNexonSn: number;
  targetWeapon: string;
}
export class UserList {
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}

export class Players {
  nickname: string;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
}
