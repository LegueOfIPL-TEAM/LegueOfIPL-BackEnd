import {
  Body,
  Controller,
  Get,
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

  @Post()
  createClanInfo(@Body() matchDetail: CreateClanInfo[]) {
    return this.clanInfoService.createClanInfo(matchDetail);
  }

  @Get()
  async test() {
    return await this.clanInfoRepository.findAllClan();
  }
}
