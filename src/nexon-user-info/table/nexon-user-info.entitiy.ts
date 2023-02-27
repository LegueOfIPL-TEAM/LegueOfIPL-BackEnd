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
export class NexonUserInfo extends Model<ClanInfo, NexonUserBattleLog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  userNexonSn: number;

  @Column({ defaultValue: 1000 })
  ladderPoint: number;

  @BelongsTo(() => ClanInfo, {
    as: 'UserInClan',
    foreignKey: 'clanInfoId',
  })
  clanInfo: ClanInfo;

  @ForeignKey(() => ClanInfo)
  clanInfoId: number;

  @HasMany(() => NexonUserBattleLog)
  userDetailInfo: NexonUserBattleLog[];
}
