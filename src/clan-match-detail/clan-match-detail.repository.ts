import {
  ConsoleLogger,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { ClAN_MATCH_DETAIL } from 'src/core/constants';
import { ClanMatchDetail } from './table/clan-match-detail.entity';

@Injectable()
export class ClanMatchDetailRepository {
  constructor(
    @Inject(ClAN_MATCH_DETAIL)
    private clanMatchDetailModel: typeof ClanMatchDetail,
  ) {}

  async createUserMatchLog({ clanInfoId, userDetails }) {}
}
