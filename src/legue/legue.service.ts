import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { GameRepository } from 'src/game/game.repository';

@Injectable()
export class LegueService {
  constructor(
    private clanRepository: ClanInfoRepository,
    private gameRepository: GameRepository,
  ) {}
  async clanDetail(clanId: number) {
    try {
      return await this.gameRepository.clanDetail(clanId);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
