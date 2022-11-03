import { Module } from "@nestjs/common";
import { RawExamQuestionService } from "./raw-exam-question.service";
import { RawExamQuestionController } from "./raw-exam-question.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamQuestion, ExamReviewRoomUser, RawExamQuestion } from "src/models";

@Module({
  imports: [
    SequelizeModule.forFeature([
      RawExamQuestion,
      ExamQuestion,
      ExamReviewRoomUser,
    ]),
  ],
  controllers: [RawExamQuestionController],
  providers: [RawExamQuestionService],
})
export class RawExamQuestionModule {}
