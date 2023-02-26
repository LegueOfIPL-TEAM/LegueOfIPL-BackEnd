import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ClanInfo } from './clanInfo.entity';
import { Game } from './game.entity';
import { NexonUserInfo } from './nexonUserInfo.entitiy';

@Table({
  tableName: 'ClanMathDetail',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class ClanMatchDetail extends Model<Game, ClanInfo> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isRedTeam: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isblueTeam: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  result: boolean;

  //belongs to clanInfo
  @BelongsTo(() => ClanInfo, {
    as: 'TeamNo',
    foreignKey: 'teamNo',
  })
  ClanInfo: ClanInfo;

  @ForeignKey(() => ClanInfo)
  targetTeamNo: number;

  //belongs to game
  @BelongsTo(() => Game, {
    as: 'gameNo',
    foreignKey: 'gameId',
  })
  game: Game;

  @ForeignKey(() => Game)
  gameId: number;
}
