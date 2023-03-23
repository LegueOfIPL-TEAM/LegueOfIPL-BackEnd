import { Inject, Injectable } from '@nestjs/common';
import { BOARD_REPOSITORY } from 'src/core/constants';
import { Board } from 'src/board/table/board.model';
import { createBoardDto } from 'src/commons/dto/board/postBoard.dto';

@Injectable()
export class BoardService {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: typeof Board,
  ) {}

  async postBoard(createBoard: createBoardDto) {
    const { title, description } = createBoard;

    const posetBoard = await this.boardRepository.create<Board>({
      title,
      description,
    });

    const response = {
      response: posetBoard,
    };

    return response;
  }

  async findAllBoard() {
    const test = await this.boardRepository.findAll<Board>();
    return test;
  }
}
