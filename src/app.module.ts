import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validation } from './commons/utils';
import { BoardModule } from './board/board.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './core/table/board.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.env',
      isGlobal: true,
      validationSchema: validation,
    }),
    BoardModule,
  ],
})
export class AppModule {}
