import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { Game } from 'src/game/table/game.entity';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserDetails } from '../clan-info.dto/clan-info.dto';

export class InsertAnyNoneData {
  existsGameInfo: Game[];
  matchClanDetails: MatchOneOfClanDetail[];
}

export class MissingPlayerInsert {
  existsPlayer: NexonUserInfo[];
  existsGameInfo: Game[];
  existsClan: ClanInfo[];
  matchInfos: MatchOneOfClanDetail[];
}

export class BattleLogsWithRelation {
  matchDetails: MatchOneOfClanDetail[];
  existsGameInfo: Game[];
  existsNexonUser: NexonUserInfo[];
}

export class MatchDetailsWithRelation {
  matchDetails: MatchOneOfClanDetail[];
  existsGameInfo: Game[];
  clanInfos: ClanInfo[];
}

export class GameDetails {
  matchKey: string;
  matchTime: Date;
  mapName: string;
  plimit: string;
}

export class MatchOneOfClanDetail {
  matchKey: string;
  result: string;
  clanName: string;
  clanNo: string;
  clanMark1: string;
  clanMark2: string;
  userList: NexonUserDetails[];
  targetClanNo: string;
}
