import { HttpException, Injectable } from '@nestjs/common';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';

@Injectable()
export class LegueService {
  constructor(
    private clanMatchRepository: ClanMatchDetailRepository,
    private battleLogRepository: NexonUserBattleLogRepository,
  ) {}
  async clanDetail(clanId: number) {
    try {
      return await this.clanMatchRepository.clanDetail(clanId);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async PlayerDetail(playerId: number) {
    try {
      return await this.battleLogRepository.playerDetail(playerId);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
