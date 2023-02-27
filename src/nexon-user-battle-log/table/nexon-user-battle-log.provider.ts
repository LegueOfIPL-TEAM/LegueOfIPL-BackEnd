import { NEXON_USER_BATTLE_LOG } from 'src/core/constants';
import { NexonUserBattleLog } from './nexon-user-battle-log.entitiy';

export const nexonUserBattleLog = [
  {
    provide: NEXON_USER_BATTLE_LOG,
    useValue: NexonUserBattleLog,
  },
];
