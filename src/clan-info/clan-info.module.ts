import { Module } from '@nestjs/common';
import { ClanInfoController } from './clan-info.controller';
import { ClanInfoService } from './clan-info.service';
import { clanInfoProvider } from './table/clan-info.provider';
import { ClanInfoRepository } from './table/clan-info.repository';

@Module({
  controllers: [ClanInfoController],
  providers: [ClanInfoService, ...clanInfoProvider, ClanInfoRepository],
})
export class ClanInfoModule {}
