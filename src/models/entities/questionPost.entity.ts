import { Sequelize } from "sequelize";
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
} from "sequelize-typescript";
import { Question } from "./question.entity";
import { User } from "./user.entity";

@Table({
  tableName: "QuestionPost",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class QuestionPost extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    allowNull: false,
  })
  questionPostId: string;

  @ForeignKey(() => Question)
  @Column({ allowNull: false })
  questionId!: number;

  @BelongsTo(() => Question, "questionId")
  question: Question;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  authorId!: number;

  @BelongsTo(() => User, "authorId")
  author: User;

  @Column({ allowNull: false })
  questionPostTitle: string;

  @Column({ allowNull: false })
  questionPostDescription: number;

  @Column({ allowNull: true })
  viewCount: number;
}
