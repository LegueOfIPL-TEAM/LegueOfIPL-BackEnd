import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserDetails } from '../clan-info.dto/clan-info.dto';

export class MatchDetailsRefactToUserId {
  userNexonSns: Array<number>;
  nexonUsers: NexonUserDetails[];
  existsNexonUser: NexonUserInfo[];
}

export class NexonUserInfoInDB {
  id: number;
  nickname: string;
  userNexonSn: number;
  kill: number;
  death: number;
  assist: number;
  damage: number;
  grade: string;
  weapon: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
