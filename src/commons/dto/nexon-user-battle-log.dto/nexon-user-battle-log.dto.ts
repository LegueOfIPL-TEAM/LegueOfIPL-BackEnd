import { Type } from 'class-transformer';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserDetails } from '../clan-info.dto/clan-info.dto';

export class MatchDetailsRefactToUserId {
  userNexonSns: Array<number>;
  nexonUsers: NexonUserDetails[];
  existsNexonUser: NexonUserInfo[];
}

export class NexonUserBattleLogsInfo {
  nickname: string;
  kill: number;
  death: number;
  assist: number;
  damage: string;
  grade: string;
  weapon: string;
  gameId: number;
  nexonUserId: number;
}
