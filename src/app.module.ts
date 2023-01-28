import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validation } from './commons/utils';
import { BoardModule } from './board/board.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './core/table/board.model';
import { DatabaseModule } from './core/database/data.module';

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
    DatabaseModule,
    BoardModule,
  ],
})
export class AppModule {}
