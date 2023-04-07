import { Inject, Injectable } from '@nestjs/common';
import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { ClAN_MATCH_DETAIL } from 'src/core/constants';
import { Game } from 'src/game/table/game.entity';
import { NexonUserBattleLog } from 'src/nexon-user-battle-log/table/nexon-user-battle-log.entitiy';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { ClanMatchDetail } from './table/clan-match-detail.entity';

@Injectable()
export class ClanMatchDetailRepository {
  constructor(
    @Inject(ClAN_MATCH_DETAIL)
    private clanMatchDetailModel: typeof ClanMatchDetail,
  ) {}
  async createClanMatchDetail(
    clanMatchDetails: ClanMatchDetail[],
  ): Promise<ClanMatchDetail[]> {
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

  async clanDetail(clanId: number) {
    return await this.clanMatchDetailModel.findAll({
      attributes: [],
      include: [
        {
          model: ClanInfo,
          where: { id: clanId },
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: Game,
          attributes: { exclude: ['createdAt', 'updatedAt'] },

          include: [
            {
              model: ClanMatchDetail,
              attributes: { exclude: ['createdAt', 'updatedAt'] },

              include: [
                {
                  model: ClanInfo,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
                {
                  model: NexonUserBattleLog,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  include: [NexonUserInfo],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}
