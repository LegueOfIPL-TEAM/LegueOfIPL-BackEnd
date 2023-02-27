import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateClanInfo } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { ClanInfoService } from './clan-info.service';
import { ClanInfoRepository } from './table/clan-info.repository';

@Controller('clan-info')
export class ClanInfoController {
  constructor(
    private clanInfoService: ClanInfoService,
    private clanInfoRepository: ClanInfoRepository,
  ) {}

  @Post('/clan-in-rank')
  findExistsClanInRank(@Body() clanNo: number[]) {
    return this.clanInfoRepository.findExistsClanInRank([1234, 12345]);
  }

  @Post()
  async createClanInfo(@Body() createClanInfo: CreateClanInfo[]) {
    return await this.clanInfoRepository.createClanInfo(createClanInfo);
  }
}
