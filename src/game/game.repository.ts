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
  async insertMatchData(gameInfo: GameDetails[]) {
    const insertGameInfoResponse = gameInfo.map(
      async ({ matchKey, matchTime }) => {
        return await this.gameEntity.bulkCreate([
          {
            matchKey,
            matchTime,
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

  async findMatchByMatchKey(matchKey: string) {
    return await this.gameEntity.findOne({
      where: {
        matchKey,
      },
    });
  }
}
