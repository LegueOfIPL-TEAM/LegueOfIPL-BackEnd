import {
  ConsoleLogger,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MatchDetails } from 'src/commons/dto/clan-info.dto/clan-info.dto';
import { MatchDetailsInResult } from 'src/commons/dto/clan-match-detail.dto/clan-match-detil.dto';
import { AllOfDataAfterRefactoring } from 'src/commons/interface/crawling.interface';
import { ClAN_MATCH_DETAIL } from 'src/core/constants';
import { ClanMatchDetail } from './table/clan-match-detail.entity';

@Injectable()
export class ClanMatchDetailRepository {
  constructor(
    @Inject(ClAN_MATCH_DETAIL)
    private clanMatchDetailModel: typeof ClanMatchDetail,
  ) {}
  async createClanMatchDetail(clanMatchDetails: MatchDetailsInResult[]) {
    const response = clanMatchDetails.map(
      async ({ isRedTeam, isBlueTeam, result, gameId, clanId }) => {
        const createMatchResult = await this.clanMatchDetailModel.bulkCreate([
          {
            isRedTeam,
            isBlueTeam,
            result,
            gameId,
            clanId,
          },
        ]);

        return createMatchResult;
      },
    );

    const waitArray = await Promise.all(response);
    const flatResponse = waitArray.flat();

    return flatResponse;
  }
}
