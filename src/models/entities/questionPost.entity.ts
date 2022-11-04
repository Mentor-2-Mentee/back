import {
  Table,
  Model,
  AutoIncrement,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { QuestionPostComment } from "./questionPostComment.entity";
import { Question } from "./question.entity";
import { User } from "./user.entity";
import { UserRelation } from "./userRelation.entity";

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
  @Column({ allowNull: false, field: "author_id" })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

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

  @HasMany(() => QuestionPostComment)
  postComment: QuestionPostComment[];
}
