import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { ClanMatchDetailRepository } from 'src/clan-match-detail/clan-match-detail.repository';
import { GameRepository } from 'src/game/game.repository';
import { NexonUserBattleLogRepository } from 'src/nexon-user-battle-log/nexon-user-battle-log.repository';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';

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
