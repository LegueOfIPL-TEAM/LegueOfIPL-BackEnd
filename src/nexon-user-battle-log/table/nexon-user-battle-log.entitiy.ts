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
import { ClanMatchDetail } from 'src/clan-match-detail/table/clan-match-detail.entity';
import { Game } from '../../game/table/game.entity';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';

@Table({
  tableName: 'NexonUserBattleLog',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class NexonUserBattleLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  nickname: string;

  @Column
  kill: number;

  @Column
  death: number;

  @Column
  assist: number;

  @Column
  damage: number;

  @Column({
    allowNull: true,
  })
  grade: string;

  @Column({
    allowNull: true,
  })
  weapon: string;

  @BelongsTo(() => Game)
  game: Game;

  @ForeignKey(() => Game)
  gameId: number;

  @BelongsTo(() => NexonUserInfo)
  nexonUserInfo: NexonUserInfo;

  @ForeignKey(() => NexonUserInfo)
  nexonUserId: number;

  @BelongsTo(() => ClanMatchDetail)
  matchDetail: ClanMatchDetail;

  @ForeignKey(() => ClanMatchDetail)
  matchId: number;
}
