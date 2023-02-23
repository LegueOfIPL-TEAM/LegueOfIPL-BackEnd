import { IsNotEmpty, IsString } from 'class-validator';

export class AllOfDataBeforRefactoring {}

export class getMatchDetails {
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

export interface userList {
  nickname: string;

  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}
