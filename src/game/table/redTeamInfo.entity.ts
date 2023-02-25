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
import { Game } from './game.entity';
import { NexonUserInfo } from './userInfo.entitiy';

@Table({
  tableName: 'RedTeamInfo',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class RedTeamInfo extends Model<Game> {
  @PrimaryKey
  @ForeignKey(() => Game)
  @AutoIncrement
  @Column
  id: number;

  @Column
  redClanName: string;

  @Column
  redClanMark1: string;

  @Column
  redClanMark2: string;

  @HasMany(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo[];

  @ForeignKey(() => NexonUserInfo)
  nexonUserId: number;

  @BelongsTo(() => Game, {
    as: 'gameResultOfRedTeam',
    foreignKey: 'gameId',
  })
  game: Game;
}
