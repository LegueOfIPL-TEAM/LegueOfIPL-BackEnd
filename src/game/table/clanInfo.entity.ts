import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ClanMatchDetail } from './clanMatchDetail.entity';
import { NexonUserInfo } from './nexonUserInfo.entitiy';

@Table({
  tableName: 'ClanInfo',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class ClanInfo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  clanNo: number;

  @Column
  clanName: string;

  @Column
  ladderPoint: number;

  @Column
  clanMark1: number;

  @Column
  clanMark2: number;

  //nexonUserInfo
  @HasMany(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo[];

  // clanMatchDetail
  @HasMany(() => ClanMatchDetail)
  clanMatchDetail: ClanMatchDetail[];
}
