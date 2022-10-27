import { Table, Model, AutoIncrement, Column } from "sequelize-typescript";

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
}
