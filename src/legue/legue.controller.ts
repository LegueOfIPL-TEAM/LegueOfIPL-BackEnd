import { Controller, Get, Param } from '@nestjs/common';
import { LegueService } from './legue.service';

@Controller('legue')
export class LegueController {
  constructor(private legueService: LegueService) {}

  @Get('/clan/:clanId')
  async findClanDetail(@Param('clanId') clanId: number) {
    return await this.legueService.clanDetail(clanId);
  }

  @Get('/player/:playerId')
  async findPlayerDetail(@Param('playerId') playerId: number) {
    return await this.legueService.PlayerDetail(playerId);
  }
}
