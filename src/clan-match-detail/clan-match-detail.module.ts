import { Module } from '@nestjs/common';
import { ClanMatchDetailController } from './clan-match-detail.controller';
import { ClanMatchDetailService } from './clan-match-detail.service';

@Module({
  controllers: [ClanMatchDetailController],
  providers: [ClanMatchDetailService]
})
export class ClanMatchDetailModule {}
