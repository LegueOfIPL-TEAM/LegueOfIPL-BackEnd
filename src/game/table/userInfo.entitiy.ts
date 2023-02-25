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
import { BlueTeamInfo } from './bleTeamInfo.entity';
import { Game } from './game.entity';
import { blueTeamIfno, redTeamInfo } from './game.provider';
import { RedTeamInfo } from './redTeamInfo.entity';
import { Player } from './players.entitiy';

@Table({
  tableName: 'NexonUserInfo',
  freezeTableName: true, //테이블에 s 붙이지 않는 옵션
  timestamps: true,
  paranoid: true,
})
export class NexonUserInfo extends Model<BlueTeamInfo, RedTeamInfo> {
  @PrimaryKey
  @ForeignKey(() => BlueTeamInfo)
  @ForeignKey(() => RedTeamInfo)
  @AutoIncrement
  @Column
  id: number;

  @Column
  nickname: string;

  @Column
  nexonSn: number;

  @Column
  ladder: number;

  @HasMany(() => Player)
  userKDA: Player[];

  @ForeignKey(() => Player)
  playerId: number;

  @BelongsTo(() => BlueTeamInfo, {
    as: 'gameResultOfBlueTeam',
    foreignKey: 'blueTeamInfoId',
  })
  blueTeamInfo: BlueTeamInfo;

  @BelongsTo(() => RedTeamInfo, {
    as: 'gameResultOfRedTeam',
    foreignKey: 'redTeamInfoId',
  })
  redTeamInfo: RedTeamInfo;
}
