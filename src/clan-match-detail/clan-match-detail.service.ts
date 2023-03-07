import { HttpException, Injectable } from '@nestjs/common';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { NexonUserInfoRepository } from 'src/nexon-user-info/nexon-user-info.repository';
import { ClanMatchDetailRepository } from './clan-match-detail.repository';

@Injectable()
export class ClanMatchDetailService {
  constructor(
    private clanMatchDetailRepository: ClanMatchDetailRepository,
    private nexonUserInfoRepository: NexonUserInfoRepository,
  ) {}
}
