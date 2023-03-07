import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/core/database/db.provider';
import { NexonUserInfoController } from './nexon-user-info.controller';
import { NexonUserInfoRepository } from './nexon-user-info.repository';
import { NexonUserInfoService } from './nexon-user-info.service';
import { nexonUserInfoproviders } from './table/nexon-user-info.provider';

@Module({
  controllers: [NexonUserInfoController],
  providers: [
    NexonUserInfoService,
    ...nexonUserInfoproviders,
    NexonUserInfoRepository,
  ],
  exports: [NexonUserInfoRepository, NexonUserInfoService],
})
export class NexonUserInfoModule {}
