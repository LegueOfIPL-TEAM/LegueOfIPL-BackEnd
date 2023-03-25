import { Module } from '@nestjs/common';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { ClanMatchDetailController } from './clan-match-detail.controller';
import { ClanMatchDetailRepository } from './clan-match-detail.repository';
import { ClanMatchDetailService } from './clan-match-detail.service';
import { clanMatchDetailProvider } from './table/clan-match-detail.provider';

@Module({
  imports: [NexonUserInfoModule],
  controllers: [ClanMatchDetailController],
  providers: [
    ClanMatchDetailService,
    ...clanMatchDetailProvider,
    ClanMatchDetailRepository,
  ],
  exports: [ClanMatchDetailService, ClanMatchDetailRepository],
})
export class ClanMatchDetailModule {}
