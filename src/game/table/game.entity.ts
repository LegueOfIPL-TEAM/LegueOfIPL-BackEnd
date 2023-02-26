// board.model.ts
import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ClanInfo } from './clanInfo.entity';
import { ClanMatchDetail } from './clanMatchDetail.entity';
import { NexonUserBattleLog } from './nexonUserBattleLog.entitiy';
import { NexonUserInfo } from './nexonUserInfo.entitiy';
@Table({
  tableName: 'Game',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class Game extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  matchKey: number;

  @Column({
    type: DataType.DATE,
  })
  matchTime: Date;

  @Column
  mapName: string;

  @Column
  plimit: string;

  @HasMany(() => NexonUserBattleLog)
  nexonUserBattleLog: NexonUserBattleLog[];

  @HasOne(() => ClanMatchDetail)
  clanMatchDetail: ClanMatchDetail;
}
