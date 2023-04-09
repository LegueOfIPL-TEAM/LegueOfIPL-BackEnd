import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get('/clan')
  async findAllMatches() {
    return await this.rankService.findClanRank();
  }

  @Get('/user')
  async findAllUserRank() {
    return await this.rankService.findUserRank();
  }
}
