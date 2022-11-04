import {
  Table,
  Model,
  AutoIncrement,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
  DefaultScope,
  Scopes,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import { QuestionPost } from "./questionPost.entity";
import { User } from "./user.entity";

@Table({
  tableName: "QuestionPostComment",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class QuestionPostComment extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => QuestionPost)
  @Column({ allowNull: false, field: "question_post_id" })
  questionPostId: number;

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
