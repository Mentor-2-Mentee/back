import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import { QuestionPost } from "./questionPost.entity";

@Table({
  tableName: "Question",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class Question extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({ allowNull: true })
  questionText: string;

  @Column({ allowNull: true })
  solution: string;

  @Column({ allowNull: false })
  rootTag: string;

  @Column({ allowNull: true, type: DataType.JSON })
  detailTag: string;

  @HasMany(() => QuestionPost)
  questionPost: QuestionPost;
}
