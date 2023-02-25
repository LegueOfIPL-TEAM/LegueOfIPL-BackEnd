import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Game } from './game.entity';
import { NexonUserInfo } from './userInfo.entitiy';

@Table({
  tableName: 'BlueTeamInfo',
  freezeTableName: true, //테이블에 s 붙이지 않는 옵션
  timestamps: true,
  paranoid: true,
})
export class BlueTeamInfo extends Model<Game> {
  @PrimaryKey
  @ForeignKey(() => Game)
  @AutoIncrement
  @Column
  id: number;

  @Column
  blueClanName: string;

  @Column
  blueClanMark1: string;

  @Column
  blueClanMark2: string;

  @HasMany(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo[];

  @ForeignKey(() => NexonUserInfo)
  nexonUserId: number;

  @BelongsTo(() => Game, {
    as: 'gameResultOfBlueTeam',
    foreignKey: 'gameId',
  })
  game: Game;
}
