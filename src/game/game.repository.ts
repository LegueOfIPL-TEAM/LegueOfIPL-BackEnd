import { Inject, Injectable } from '@nestjs/common';
import { GameDetails } from 'src/commons/dto/game.dto/game.dto';
import { GAME_ENTITY } from 'src/core/constants';
import { Game } from './table/game.entity';

@Injectable()
export class GameRepository {
  constructor(
    @Inject(GAME_ENTITY)
    private gameEntity: typeof Game, // @Inject(NEXON_USER_INFO)
  ) {}

  async findByMatchKey(matchKey: string) {
    const existingMatch = await this.gameEntity.findOne({
      where: { matchKey },
    });

    return !!existingMatch;
  }
  async insertMatchData(gameInfo: GameDetails[]) {
    const insertGameInfoResponse = gameInfo.map(
      async ({ matchKey, mapName, matchTime, plimit }) => {
        return await this.gameEntity.bulkCreate([
          {
            matchKey,
            mapName,
            matchTime,
            plimit,
          },
        ]);
      },
    );

    const response = await Promise.all(insertGameInfoResponse);
    const flatResponse = response.flat();

    return flatResponse;
  }

  async findAllMatchKey(matchKey: Array<string>) {
    const findAllMatchKeysInGame = await this.gameEntity.findAll({
      where: {
        matchKey: matchKey,
      },
    });

    return findAllMatchKeysInGame;
  }
}
