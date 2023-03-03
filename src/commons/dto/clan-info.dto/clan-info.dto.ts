import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class findManyclanNo {
  clanNo: string[];
}

export class CreateClanInfo {
  readonly redResult: string;

  readonly redClanNo: number;

  readonly redClanName: string;

  readonly redClanMark1: string;

  readonly redClanMark2: string;

  readonly redUserList: nexonUserInfo[];

  readonly blueResult: string;

  readonly blueClanNo: number;

  readonly blueClanName: string;

  readonly blueClanMark1: string;

  readonly blueClanMark2: string;

  readonly blueUserList: nexonUserInfo[];
}

export class nexonUserInfo {
  nickname: string;
  userNexonSn: string;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
}
