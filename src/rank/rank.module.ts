import { Module } from '@nestjs/common';
import { ClanInfoModule } from 'src/clan-info/clan-info.module';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';

@Module({
  imports: [ClanInfoModule, NexonUserInfoModule],
  controllers: [RankController],
  providers: [RankService],
})
export class RankModule {}
