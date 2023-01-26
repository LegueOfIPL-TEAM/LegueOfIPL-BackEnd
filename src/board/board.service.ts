import { Inject, Injectable } from '@nestjs/common';
import { BOARD_REPOSITORY } from 'src/core/constants';
import { Board } from 'src/core/table/board.model';

@Injectable()
export class BoardService {
    constructor(
        @Inject(BOARD_REPOSITORY)
    private boardRepository: typeof Board
    ){}

    async postBoard({title, description}) {
        const posetBoard = await this.boardRepository.create({
            title, description
        })

        const response = {
            response : posetBoard
        }
        
        return response;
    }

    async findAllBoard(){
        return await this.boardRepository.findAll()
    }
}
