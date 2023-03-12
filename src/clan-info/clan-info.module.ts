import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseProviders } from 'src/core/database/db.provider';
import { NexonUserInfoModule } from 'src/nexon-user-info/nexon-user-info.module';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { ClanInfoController } from './clan-info.controller';
import { ClanInfoService } from './clan-info.service';
import { clanInfoProvider } from './table/clan-info.provider';
import { ClanInfoRepository } from './clan-info.repository';

@Module({
  imports: [NexonUserInfoModule],
  controllers: [ClanInfoController],
  providers: [
    ClanInfoService,
    ...clanInfoProvider,
    ...databaseProviders,
    ClanInfoRepository,
  ],
  exports: [ClanInfoService, ClanInfoRepository],
})
export class ClanInfoModule {}
