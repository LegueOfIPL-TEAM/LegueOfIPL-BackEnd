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
import { Game } from './game.entity';
import { NexonUserInfo } from './nexonUserInfo.entitiy';

@Table({
  tableName: 'NexonUserBattleLog',
  freezeTableName: true, //테이블에 s 붙이지 않는 옵션
  timestamps: true,
  paranoid: true,
})
export class NexonUserBattleLog extends Model<Game, NexonUserInfo> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nickname: string;

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

  @BelongsTo(() => Game, {
    as: 'MatchOfPlayerDetails',
    foreignKey: 'gameId',
  })
  game: Game;

  @ForeignKey(() => Game)
  gameId: number;

  @BelongsTo(() => NexonUserInfo, {
    as: 'KADofPlayers',
    foreignKey: 'nexonUserId',
  })
  nexonUserInfo: NexonUserInfo;

  @ForeignKey(() => NexonUserInfo)
  nexonUserId: NexonUserInfo;
}
