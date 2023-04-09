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
import { ClanInfo } from '../../clan-info/table/clan-info.entity';
import { Game } from '../../game/table/game.entity';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';

@Table({
  tableName: 'ClanMathDetail',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class ClanMatchDetail extends Model {
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
  isBlueTeam: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  result: boolean;

  //belongs to clanInfo
  @BelongsTo(() => ClanInfo)
  ClanInfo: ClanInfo;

  @ForeignKey(() => ClanInfo)
  clanId: number;

  //belongs to game
  @BelongsTo(() => Game)
  game: Game;

  @ForeignKey(() => Game)
  gameId: number;
}
