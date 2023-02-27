import { Body, Controller, Get, Post } from '@nestjs/common';
import { title } from 'process';
import { Board } from 'src/board/table/board.model';
import { BoardService, createBoardDto } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async postBoard(@Body() createBoard: createBoardDto) {
    return await this.boardService.postBoard(createBoard);
  }

  @Get()
  async listBoard() {
    return await this.boardService.findAllBoard();
  }
}
