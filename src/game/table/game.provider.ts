import { GAME_ENTITY } from 'src/core/constants';
import { Game } from 'src/game/table/game.entity';

export const gameProviders = [
  {
    provide: GAME_ENTITY,
    useValue: Game,
  },
];
