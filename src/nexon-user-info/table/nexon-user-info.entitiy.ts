import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
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
export class NexonUserInfo extends Model<ClanInfo> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  userNexonSn: number;

  @Column({ defaultValue: 1000 })
  ladderPoint: number;

  @ForeignKey(() => ClanInfo)
  clanInfoId: number;

  @BelongsTo(() => ClanInfo, {
    foreignKey: 'clanInfoId',
  })
  clanInfo: ClanInfo;

  @HasMany(() => NexonUserBattleLog)
  userDetailInfo: NexonUserBattleLog[];
}
