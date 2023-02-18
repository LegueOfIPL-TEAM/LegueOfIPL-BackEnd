import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from 'src/core/table/board.model';
import { boardProviders } from 'src/core/table/board.provider';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  providers: [BoardService, ...boardProviders],
  controllers: [BoardController],
})
export class BoardModule {}
