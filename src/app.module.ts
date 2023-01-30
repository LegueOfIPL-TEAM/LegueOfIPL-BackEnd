import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validation } from './commons/utils';
import { BoardModule } from './board/board.module';
import { DatabaseModule } from './core/database/data.module';
import { CrawlingModule } from './crawling/crawling.module';

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
    CrawlingModule,
    DatabaseModule,
    BoardModule,
  ],
})
export class AppModule {}
