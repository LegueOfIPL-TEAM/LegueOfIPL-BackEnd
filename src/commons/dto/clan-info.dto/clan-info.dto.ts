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

  readonly redUserList: NexonUserDetails[];

  readonly blueResult: string;

  readonly blueClanNo: string;

  readonly blueClanName: string;

  readonly blueClanMark1: string;

  readonly blueClanMark2: string;

  readonly blueUserList: NexonUserDetails[];
}

export class NexonUserDetails {
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}

export class NexonClanInfoDetails {
  clanName: string;
  clanNo: string;
  clanMark1: string;
  clanMark2: string;
}
