import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BlueTeamInfo } from './bleTeamInfo.entity';
import { RedTeamInfo } from './redTeamInfo.entity';
import { NexonUserInfo } from './userInfo.entitiy';

@Table({
  tableName: 'Player',
  freezeTableName: true, //테이블에 s 붙이지 않는 옵션
  timestamps: true,
  paranoid: true,
})
export class Player extends Model<NexonUserInfo> {
  @PrimaryKey
  @ForeignKey(() => NexonUserInfo)
  @AutoIncrement
  @Column
  id: number;

  @Column
  kill: number;

  @Column
  detah: number;

  @Column
  assist: number;

  @Column
  damage: number;

  @Column
  grade: string;

  @AllowNull
  @Column
  weapon: string;

  @BelongsTo(() => NexonUserInfo, {
    as: 'KADofPlayers',
    foreignKey: 'nexonUserId',
  })
  nexonUserInfo: NexonUserInfo;
}
