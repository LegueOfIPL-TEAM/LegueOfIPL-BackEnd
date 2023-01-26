// board.model.ts
import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
  } from 'sequelize-typescript';
  
  @Table({ timestamps: true, paranoid: true })
  export class Board extends Model {
    @PrimaryKey
    @Column
    id: number;
  
    @Column
    title: string;
  
    @Column(DataType.TEXT)
    discription:string;
  }