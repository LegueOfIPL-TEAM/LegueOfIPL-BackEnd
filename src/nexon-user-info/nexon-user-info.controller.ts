import { Body, Controller, Post } from '@nestjs/common';
import { MatchDetails } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { NexonUserInfoService } from './nexon-user-info.service';

@Controller('nexon-user-info')
export class NexonUserInfoController {
  constructor(private nexonUserInfoService: NexonUserInfoService) {}

  @Post()
  async test(@Body() matchDetails: MatchDetails[]) {
    return await this.nexonUserInfoService.createUserInfo(matchDetails);
  }
}
