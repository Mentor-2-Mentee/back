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
import { User } from "./user.entity";

@Table({
  tableName: "PostComment",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class PostComment extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false, field: "post_id" })
  postId: number;

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
