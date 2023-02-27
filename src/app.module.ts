import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validation } from './commons/utils';
import { BoardModule } from './board/board.module';
import { DatabaseModule } from './core/database/data.module';
import { CrawlingModule } from './crawling/crawling.module';
import { GameModule } from './game/game.module';
import { NexonUserBattleLogModule } from './nexon-user-battle-log/nexon-user-battle-log.module';
import { ClanInfoModule } from './clan-info/clan-info.module';
import { ClanMatchDetailModule } from './clan-match-detail/clan-match-detail.module';
import { NexonUserInfoModule } from './nexon-user-info/nexon-user-info.module';

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
    GameModule,
    NexonUserBattleLogModule,
    ClanInfoModule,
    ClanMatchDetailModule,
    NexonUserInfoModule,
  ],
})
export class AppModule {}
