// board.model.ts
import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ClanInfo } from '../../clan-info/table/clan-info.entity';
import { ClanMatchDetail } from '../../clan-match-detail/table/clan-match-detail.entity';
import { NexonUserBattleLog } from '../../nexon-user-battle-log/table/nexon-user-battle-log.entitiy';
import { NexonUserInfo } from '../../nexon-user-info/table/nexon-user-info.entitiy';
@Table({
  tableName: 'Game',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
})
export class Game extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  matchKey: string;

  @Column({
    type: DataType.DATE,
  })
  matchTime: Date;

  @HasMany(() => NexonUserBattleLog)
  nexonUserBattleLog: NexonUserBattleLog[];

  @HasMany(() => ClanMatchDetail)
  clanMatchDetail: ClanMatchDetail[];
}
