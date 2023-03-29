import { LargeNumberLike } from 'crypto';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ClanInfo } from '../../clan-info/table/clan-info.entity';
import { NexonUserBattleLog } from '../../nexon-user-battle-log/table/nexon-user-battle-log.entitiy';

@Table({
  tableName: 'NexonUserInfo',
  freezeTableName: true, //테이블에 s 붙이지 않는 옵션
  timestamps: true,
  paranoid: true,
})
export class NexonUserInfo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.INTEGER,
  })
  userNexonSn: number;

  @Column({ defaultValue: 1000 })
  ladderPoint: number;

  @Column
  killPoint: number;

  @Column
  deathPoint: number;

  @Column
  totalKd: number;

  @Column
  kdRate: string;

  @Column
  winCount: number;

  @Column
  loseCount: number;

  @Column
  totalWinningPoint: string;

  @Column
  winningRate: string;

  @HasMany(() => NexonUserBattleLog)
  userDetailInfo: NexonUserBattleLog[];
}
