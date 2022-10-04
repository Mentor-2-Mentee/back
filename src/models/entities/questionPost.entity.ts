import { Sequelize } from "sequelize";
import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { Question } from "./question.entity";

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
  })
  questionPostId: number;

  @ForeignKey(() => Question)
  @Column({ allowNull: false })
  questionId!: number;

  @BelongsTo(() => Question)
  question: Question;

  @Column({ allowNull: false })
  author: string;

  @Column({ allowNull: false })
  questionPostTitle: string;

  @Column({ allowNull: false })
  questionPostDescription: number;

  @Column({ allowNull: false })
  viewCount: number;
}
