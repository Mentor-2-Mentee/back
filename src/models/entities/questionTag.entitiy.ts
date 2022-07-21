import { Column, Model, Table, AutoIncrement } from "sequelize-typescript";

@Table({
  tableName: "QuestionTags",
  createdAt: false,
  updatedAt: false,
})
export class QuestionTag extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: true })
  parentFilterTag: string;

  @Column({ allowNull: false })
  tagName: string;
}
