import { ClAN_MATCH_DETAIL } from 'src/core/constants';
import { ClanMatchDetail } from './clan-match-detail.entity';

export const clanMatchDetailProvider = [
  {
    provide: ClAN_MATCH_DETAIL,
    useValue: ClanMatchDetail,
  },
];
