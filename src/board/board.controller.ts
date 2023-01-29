import { Body, Controller, Get, Post } from '@nestjs/common';
import { title } from 'process';
import { Board } from 'src/core/table/board.model';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
    constructor(
        private boardService: BoardService
    ){}

    @Post()
    async postBoard(
        @Body() title, description
    ) {
        return await this.boardService.postBoard({
            title,
            description
        })
    }

    @Get()
    async listBoard() {
        return await this.boardService.findAllBoard()
    }
}
