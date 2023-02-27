import { Module } from '@nestjs/common';
import { boardProviders } from 'src/board/table/board.provider';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  providers: [BoardService, ...boardProviders],
  controllers: [BoardController],
})
export class BoardModule {}
