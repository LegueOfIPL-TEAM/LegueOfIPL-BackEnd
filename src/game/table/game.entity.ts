// board.model.ts
import {
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BlueTeamInfo } from './bleTeamInfo.entity';
import { RedTeamInfo } from './redTeamInfo.entity';

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
  matchKey: number;

  @Column({
    type: DataType.DATE,
  })
  matchTime: Date;

  @Column
  mapName: string;

  @Column
  plimit: string;

  @Column
  blueResult: string;

  @Column
  redResult: string;

  @HasOne(() => BlueTeamInfo)
  blueTeamInfo: BlueTeamInfo;

  @ForeignKey(() => BlueTeamInfo)
  @Column
  blueTeamInfoId: number;

  @HasOne(() => RedTeamInfo)
  redTeamInfo: RedTeamInfo;

  @ForeignKey(() => RedTeamInfo)
  @Column
  redTeamInfoId: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt: Date;
}
