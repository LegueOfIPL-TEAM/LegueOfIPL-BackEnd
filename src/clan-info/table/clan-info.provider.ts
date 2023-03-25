import { CLAN_INFO } from 'src/core/constants';
import { ClanInfo } from './clan-info.entity';

export const clanInfoProvider = [
  {
    provide: CLAN_INFO,
    useValue: ClanInfo,
  },
];
