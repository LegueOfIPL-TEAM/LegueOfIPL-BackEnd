import { Inject, Injectable } from '@nestjs/common';
import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { ClanMatchDetail } from 'src/clan-match-detail/table/clan-match-detail.entity';
import { NexonUserBattleLogsInfo } from 'src/commons/dto/nexon-user-battle-log.dto/nexon-user-battle-log.dto';
import { NEXON_USER_BATTLE_LOG } from 'src/core/constants';
import { Game } from 'src/game/table/game.entity';
import { NexonUserInfo } from 'src/nexon-user-info/table/nexon-user-info.entitiy';
import { NexonUserBattleLog } from './table/nexon-user-battle-log.entitiy';

@Injectable()
export class NexonUserBattleLogRepository {
  constructor(
    @Inject(NEXON_USER_BATTLE_LOG)
    private nexonUserBattleLogModel: typeof NexonUserBattleLog,
  ) {}

  async createMatchDetailsWithUserId(
    userBattleLogs: NexonUserBattleLogsInfo[],
  ) {
    const response = userBattleLogs.map(
      async ({
        nickname,
        kill,
        death,
        assist,
        damage,
        grade,
        weapon,
        gameId,
        nexonUserId,
        matchId,
      }) => {
        console.log(gameId);
        const createBattleLog = await this.nexonUserBattleLogModel.bulkCreate([
          {
            nickname,
            kill,
            death,
            assist,
            damage:
              damage === '0' ? Number(damage) : Number(damage.replace(',', '')),
            grade: grade.trim() === '' ? null : grade.trim(),
            weapon,
            gameId,
            nexonUserId,
            matchId,
          },
        ]);
        return createBattleLog;
      },
    );

    const waitArray = await Promise.all(response);
    const flatResponse = waitArray.flat();

    return flatResponse;
  }

  async playerDetail(playerId: number) {
    return await this.nexonUserBattleLogModel.findAll({
      attributes: [],
      include: [
        { model: NexonUserInfo, where: { id: playerId } },
        {
          model: Game,
          include: [
            {
              model: ClanMatchDetail,
              include: [
                ClanInfo,
                { model: NexonUserBattleLog, include: [NexonUserInfo] },
              ],
            },
          ],
        },
      ],
    });
  }
}
