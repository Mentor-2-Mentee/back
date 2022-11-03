import {
  Table,
  Model,
  AutoIncrement,
  Column,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ExamQuestion } from "./examQuestion.entity";

@Table({
  tableName: "ExamQuestionComment",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class ExamQuestionComment extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ExamQuestion)
  @Column({ allowNull: false, field: "exam_question_id" })
  examQuestionId: number;

  @Column({ allowNull: false, field: "comment_level" })
  commentLevel: number;

  @Column({ allowNull: true, field: "parent_comment_id" })
  parentCommentId: number;

  @Column({ allowNull: false, field: "comment" })
  comment: string;

  @Column({ allowNull: false, field: "author" })
  author: string;

  @Column({ allowNull: false, field: "author_id" })
  authorId: string;

  @BelongsTo(() => ExamQuestion)
  examQuestion: ExamQuestion;
}
