import {
  CLAN_INFO,
  ClAN_MATCH_DETAIL,
  GAME_ENTITY,
  NEXON_USER_BATTLE_LOG,
  NEXON_USER_INFO,
} from 'src/core/constants';
import { Game } from 'src/game/table/game.entity';
import { ClanInfo } from './clanInfo.entity';
import { ClanMatchDetail } from './clanMatchDetail.entity';
import { NexonUserBattleLog } from './nexonUserBattleLog.entitiy';
import { NexonUserInfo } from './nexonUserInfo.entitiy';

export const gameProviders = [
  {
    provide: GAME_ENTITY,
    useValue: Game,
  },
];

export const clanInfo = [
  {
    provide: CLAN_INFO,
    useVlaue: ClanInfo,
  },
];

export const nexonUserInfo = [
  {
    provide: NEXON_USER_INFO,
    useValue: NexonUserInfo,
  },
];

export const nexonUserBattleLog = [
  {
    provide: NEXON_USER_BATTLE_LOG,
    useValue: NexonUserBattleLog,
  },
];

export const clanMatchDetail = [
  {
    provide: ClAN_MATCH_DETAIL,
    useValue: ClanMatchDetail,
  },
];
