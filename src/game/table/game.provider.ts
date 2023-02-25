import {
  BLUE_TEAM_INFO_ENTITY,
  GAME_ENTITY,
  NEXON_USER_INFO,
  PLAYER,
  RED_TEAM_INFO_ENTITY,
} from 'src/core/constants';
import { Game } from 'src/game/table/game.entity';
import { BlueTeamInfo } from './bleTeamInfo.entity';
import { Player } from './players.entitiy';
import { RedTeamInfo } from './redTeamInfo.entity';
import { NexonUserInfo } from './userInfo.entitiy';

export const gameProviders = [
  {
    provide: GAME_ENTITY,
    useValue: Game,
  },
];

export const blueTeamIfno = [
  {
    provide: BLUE_TEAM_INFO_ENTITY,
    useValue: BlueTeamInfo,
  },
];

export const redTeamInfo = [
  {
    provide: RED_TEAM_INFO_ENTITY,
    useValue: RedTeamInfo,
  },
];

export const nexonUserInfo = [
  {
    provide: NEXON_USER_INFO,
    useValue: NexonUserInfo,
  },
];

export const players = [
  {
    provide: PLAYER,
    useValue: Player,
  },
];
