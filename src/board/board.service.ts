import { Inject, Injectable } from '@nestjs/common';
import { BOARD_REPOSITORY } from 'src/core/constants';
import { Board } from 'src/board/table/board.model';
export class createBoardDto {
  title: string;
  description: string;
}
@Injectable()
export class BoardService {
  constructor(
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: typeof Board,
  ) {}

  async postBoard(createBoard: createBoardDto) {
    console.log(createBoard);
    const { title, description } = createBoard;

    console.log(title, description);
    const posetBoard = await this.boardRepository.create<Board>({
      title,
      description,
    });
    console.log(posetBoard);

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
