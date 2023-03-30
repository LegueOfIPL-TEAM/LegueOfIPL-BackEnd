import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { Game } from 'src/game/table/game.entity';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserDetails } from '../clan-info.dto/clan-info.dto';
export class updateLadderPointMissingData {
  matchDetails: MatchOneOfClanDetail[];
  existsClan: ClanInfo[];
  existsUser: NexonUserInfo[];
}

export class updateClanAndUserLadderDto {
  matchDetails: MatchOneOfClanDetail[];
  existingClan: ClanInfo[];
  existingUser: NexonUserInfo[];
  existingGame: Game[];
}

export class CreateClanAndUserDTO {
  matchDetails: MatchOneOfClanDetail[];
  newClan: ClanInfo[];
  newUser: NexonUserInfo[];
  existingGame: Game[];
}

export class UpdateAndCreateAllMatchData {
  matchDetails: MatchOneOfClanDetail[];
  existingClan: ClanInfo[];
  newClan: ClanInfo[];
  existingUser: NexonUserInfo[];
  newUser: NexonUserInfo[];
  existingGame: Game[];
}

export class BattleLogsAndMatchDetailWithRelation {
  matchDetails: MatchOneOfClanDetail[];
  existsGameInfo: Game[];
  existsNexonUser: NexonUserInfo[];
  existingClan: ClanInfo[];
}

export class MatchDetailsWithRelation {
  matchDetails: MatchOneOfClanDetail[];
  existsGameInfo: Game[];
  clanInfos: ClanInfo[];
}

export class GameDetails {
  matchKey: string;
  matchTime: string;
}

export class MatchOneOfClanDetail {
  matchKey: string;
  result: string;
  clanName: string;
  clanNo: string;
  clanMark1: string;
  clanMark2: string;
  userList: NexonUserDetails[];
}
