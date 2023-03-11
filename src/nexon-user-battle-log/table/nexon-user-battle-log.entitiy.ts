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
import { ClanInfo } from 'src/clan-info/table/clan-info.entity';
import { Game } from '../../game/table/game.entity';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';

@Table({
  tableName: 'NexonUserBattleLog',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class NexonUserBattleLog extends Model<ClanInfo, Game> {
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

  @Column
  weapon: string;

  @BelongsTo(() => Game)
  game: Game;

  @ForeignKey(() => Game)
  gameId: number;

  @BelongsTo(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo;

  @ForeignKey(() => NexonUserInfo)
  nexonUserId: number;
}
