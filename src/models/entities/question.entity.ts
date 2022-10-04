import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
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
  })
  questionId: number;

  @Column({ allowNull: false, type: DataType.JSON })
  rootTag: string;

  @Column({ allowNull: true, type: DataType.JSON })
  detailTag: string[];

  @Column({ allowNull: false })
  questionType: string;

  @Column({ allowNull: true })
  questionText: string;

  @Column({ allowNull: true, type: DataType.JSON })
  answerExample: string;

  @Column({ allowNull: true, type: DataType.JSON })
  questionImageUrl: string;

  @Column({ allowNull: true })
  solution: string;

  @Column({ allowNull: true })
  answer: string;

  @HasMany(() => QuestionPost)
  questionPost: QuestionPost[];
}
