import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ClanMatchDetail } from '../../clan-match-detail/table/clan-match-detail.entity';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';

@Table({
  tableName: 'ClanInfo',
  timestamps: true,
  paranoid: false,
})
export class ClanInfo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  clanNo: string;

  @Column
  clanName: string;

  @Column({ defaultValue: 1000 })
  ladderPoint: number;

  @Column
  clanMark1: string;

  @Column
  clanMark2: string;

  @Column
  winCount: number;

  @Column
  loseCount: number;

  @Column
  totalWinningPoint: number;

  @Column
  winningRate: string;

  // clanMatchDetail
  @HasMany(() => ClanMatchDetail)
  clanMatchDetail: ClanMatchDetail[];
}
