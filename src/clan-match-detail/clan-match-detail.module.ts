import { Module } from '@nestjs/common';
import { ClanMatchDetailController } from './clan-match-detail.controller';
import { ClanMatchDetailService } from './clan-match-detail.service';
import { clanMatchDetailProvider } from './table/clan-match-detail.provider';

@Module({
  controllers: [ClanMatchDetailController],
  providers: [ClanMatchDetailService, ...clanMatchDetailProvider],
})
export class ClanMatchDetailModule {}
