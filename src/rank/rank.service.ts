import { HttpException, Injectable } from '@nestjs/common';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';

@Injectable()
export class RankService {
  constructor(
    private clanRepository: ClanInfoRepository,
    private nexonUserRepository: NexonUserInfoRepository,
  ) {}
  async findClanRank() {
    try {
      return await this.clanRepository.findClanRank();
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  async findUserRank() {
    try {
      return await this.nexonUserRepository.nexonUserRank();
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
