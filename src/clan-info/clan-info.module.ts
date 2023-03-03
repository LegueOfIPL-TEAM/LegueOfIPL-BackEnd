import { Module } from '@nestjs/common';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { ClanInfoController } from './clan-info.controller';
import { ClanInfoService } from './clan-info.service';
import { clanInfoProvider } from './table/clan-info.provider';
import { ClanInfoRepository } from './table/clan-info.repository';

@Module({
  imports: [NexonUserInfoModule],
  controllers: [ClanInfoController],
  providers: [ClanInfoService, ...clanInfoProvider, ClanInfoRepository],
})
export class ClanInfoModule {}
