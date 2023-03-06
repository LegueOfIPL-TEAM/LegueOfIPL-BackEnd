import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class findManyclanNo {
  clanNo: string[];
}

export class MatchDetails {
  readonly redResult: string;

  readonly redClanNo: string;

  readonly redClanName: string;

  readonly redClanMark1: string;

  readonly redClanMark2: string;

  readonly redUserList: NexonUserInfo[];

  readonly blueResult: string;

  readonly blueClanNo: string;

  readonly blueClanName: string;

  readonly blueClanMark1: string;

  readonly blueClanMark2: string;

  readonly blueUserList: NexonUserInfo[];
}

export class NexonUserInfo {
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}
