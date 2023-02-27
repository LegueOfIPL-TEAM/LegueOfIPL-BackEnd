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
import { ClanMatchDetail } from '../../clan-match-detail/table/clan-match-detail.entity';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';

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

  @Column({ defaultValue: 1000 })
  ladderPoint: number;

  @Column
  clanMark1: string;

  @Column
  clanMark2: string;

  //nexonUserInfo
  @HasMany(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo[];

  // clanMatchDetail
  @HasMany(() => ClanMatchDetail)
  clanMatchDetail: ClanMatchDetail[];
}
