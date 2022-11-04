import {
  Table,
  Model,
  AutoIncrement,
  Column,
  BelongsTo,
  ForeignKey,
  HasOne,
} from "sequelize-typescript";
import { ExamQuestion } from "./examQuestion.entity";
import { ExamReviewRoomUser } from "./examReviewRoomUser.entity";
import { User } from "./user.entity";

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

  @ForeignKey(() => ExamQuestion)
  @Column({ allowNull: false, field: "exam_question_id" })
  examQuestionId: number;

  @BelongsTo(() => ExamQuestion)
  examQuestion: ExamQuestion;

  @ForeignKey(() => User)
  @Column({ allowNull: false, field: "author_id" })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

  @ForeignKey(() => ExamReviewRoomUser)
  @Column({ allowNull: false, field: "exam_review_room_user_id" })
  examReviewRoomUserId: string;

  @BelongsTo(() => ExamReviewRoomUser)
  examReviewRoomUser: ExamReviewRoomUser;

  @Column({ allowNull: true, field: "question_text" })
  questionText: string;

  @Column({ allowNull: true, field: "solution" })
  solution: string;
}
