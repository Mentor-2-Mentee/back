import {
  Table,
  Model,
  AutoIncrement,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
  DefaultScope,
} from "sequelize-typescript";
import { QuestionPostComment } from "./questionPostComment.entity";
import { Question } from "./question.entity";
import { User } from "./user.entity";
import { UserRelation } from "./userRelation.entity";

@DefaultScope(() => ({
  attributes: [
    "id",
    "questionId",
    "authorId",
    "guestName",
    "title",
    "description",
    "viewCount",
    "createdAt",
  ],
}))
@Table({
  tableName: "QuestionPost",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class QuestionPost extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Question)
  @Column({ allowNull: false, field: "question_id" })
  questionId: number;

  @BelongsTo(() => Question)
  question: Question;

  @ForeignKey(() => User)
  @Column({ allowNull: true, field: "author_id" })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

  @Column({ allowNull: true, field: "guest_name" })
  guestName: string;

  @Column({ allowNull: true, field: "guest_password" })
  guestPassword: string;

  @Column({ allowNull: false, field: "title" })
  title: string;

  @Column({ allowNull: false, field: "description" })
  description: string;

  @Column({ allowNull: true, field: "view_count" })
  viewCount: number;

  @HasMany(() => UserRelation, {
    onDelete: "CASCADE",
  })
  userRelations?: UserRelation[];

  @HasMany(() => QuestionPostComment, {
    onDelete: "CASCADE",
  })
  postComment: QuestionPostComment[];
}
