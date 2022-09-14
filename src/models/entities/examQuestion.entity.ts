import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";

type QuestionType = "MULTIPLE_CHOICE" | "ESSAY_QUESTION";

@Table({
  tableName: "ExamQuestion",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class ExamQuestion extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  examQuestionId: number;

  @Column({ allowNull: true })
  questionText: string;

  @Column({ allowNull: false, type: DataType.JSON })
  answerExampleList: string[];

  @Column({ allowNull: true })
  solution: string;

  @Column({ allowNull: true })
  answer: string;

  @Column({ allowNull: true, type: DataType.JSON })
  questionImageUrl: string;

  @Column({ allowNull: false })
  questionType: QuestionType;

  @Column({ allowNull: false })
  examScheduleId: number;

  @Column({ allowNull: false })
  examField: string;
}
