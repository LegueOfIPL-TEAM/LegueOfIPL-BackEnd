import { BOARD_REPOSITORY } from '../../core/constants';
import { Board } from './board.model';

export const boardProviders = [
  {
    provide: BOARD_REPOSITORY,
    useValue: Board,
  },
];
