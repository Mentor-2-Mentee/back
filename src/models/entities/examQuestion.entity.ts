import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { ExamReviewRoom } from "./examReviewRoom.entity";
import { RawExamQuestion } from "./rawExamQuestion.entity";

type QuestionType = "MULTIPLE_CHOICE" | "ESSAY_QUESTION";

@Table({
  tableName: "ExamQuestion",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class ExamQuestion extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: true, field: "question_text" })
  questionText: string;

  @Column({ allowNull: true, field: "question_image_url", type: DataType.JSON })
  questionImageUrl: string[];

  @Column({ allowNull: false, field: "answer_example", type: DataType.JSON })
  answerExample: string[];

  @Column({ allowNull: true, field: "solution" })
  solution: string;

  @Column({ allowNull: true, field: "answer" })
  answer: string;

  /**
   * ex: 객관식
   */
  @Column({ allowNull: false, field: "question_type" })
  questionType: QuestionType;

  /**
   * ex: 서부발전
   */
  @Column({ allowNull: false, field: "exam_organizer" })
  examOrganizer: string;

  /**
   * ex: 화공직
   */
  @Column({ allowNull: false, field: "exam_type" })
  examType: string;

  @Column({
    allowNull: true,
    field: "raw_exam_question_id",
    type: DataType.JSON,
  })
  rawExamQuestionId: number[];

  @Column({
    allowNull: true,
    field: "comment_id",
    type: DataType.JSON,
  })
  commentId: number[];
}
