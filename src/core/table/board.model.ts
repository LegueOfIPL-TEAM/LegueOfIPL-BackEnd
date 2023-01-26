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
    // @Column
    // @PrimaryKey
    // id: number;
  
    // @Column
    // author: string;
  
    // @Column(DataType.TEXT)
    // context:string;
  }