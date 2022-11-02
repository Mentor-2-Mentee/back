import {
  Table,
  Model,
  AutoIncrement,
  Column,
  BelongsTo,
} from "sequelize-typescript";
import { ExamQuestion } from "./examQuestion.entity";

@Table({
  tableName: "RawExamQuestion",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class RawExamQuestion extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false, field: "exam_question_id" })
  examQuestionId: number;

  @Column({ allowNull: false, field: "author_id" })
  authorId: string;

  @Column({ allowNull: true, field: "question_text" })
  questionText: string;

  @Column({ allowNull: true, field: "solution" })
  solution: string;
}
