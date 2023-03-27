import { Controller, Get, Param } from '@nestjs/common';
import { ClanInfoRepository } from 'src/clan-info/clan-info.repository';
import { LegueService } from './legue.service';

@Controller('legue')
export class LegueController {
  constructor(private legueService: LegueService) {}

  @Get('/clan/:clanId')
  async findClanDetail(@Param('clanId') clanId: number) {
    return await this.legueService.clanDetail(clanId);
  }
}
