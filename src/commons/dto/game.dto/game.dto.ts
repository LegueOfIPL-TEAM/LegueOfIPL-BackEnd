import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { Game } from 'src/game/table/game.entity';
import { NexonUserDetails } from '../clan-info.dto/clan-info.dto';
import { NexonUserInfo } from '../nexon-user-info.dto/nexon-user-info.dto';

export class InsertAnyNoneData {
  existsGameInfo: Game[];
  nexonUserDetails: NexonUserInfo[];
  matchClanDetails: MatchClanInfoDetails[];
}

export class GameDetails {
  matchKey: string;
  matchTime: Date;
  mapName: string;
  plimit: string;
}

export class MatchClanInfoDetails {
  matchKey: string;
  result: string;
  clanName: string;
  clanNo: string;
  clanMark1: string;
  clanMark2: string;
  userList: NexonUserDetails[];
  targetClanNo: string;
}
