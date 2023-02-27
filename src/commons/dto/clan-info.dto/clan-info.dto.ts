import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class findManyclanNo {
  clanNo: string[];
}

export class CreateClanInfo {
  redResult: string;

  @IsNumber()
  @Type(() => Number)
  readonly redClanNo: number;

  readonly redClanName: string;

  readonly redClanMark1: string;

  readonly redClanMark2: string;

  readonly blueResult: string;

  @IsNumber()
  @Type(() => Number)
  readonly blueClanNo: number;

  readonly blueClanName: string;

  readonly blueClanMark1: string;

  readonly blueClanMark2: string;
}
