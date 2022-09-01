import { Column, Model, Table, AutoIncrement } from "sequelize-typescript";

@Table({
  tableName: "QuestionTag",
  createdAt: false,
  updatedAt: false,
})
export class QuestionTag extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  questionTagId: number;

  @Column({ allowNull: true })
  parentTag?: string;

  @Column({ allowNull: false })
  tagName: string;
}
