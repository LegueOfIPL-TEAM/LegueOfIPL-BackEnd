import { Module } from '@nestjs/common';
import { NexonUserInfoController } from './nexon-user-info.controller';
import { NexonUserInfoService } from './nexon-user-info.service';

@Module({
  controllers: [NexonUserInfoController],
  providers: [NexonUserInfoService]
})
export class NexonUserInfoModule {}
