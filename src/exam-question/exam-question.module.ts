import { Module } from "@nestjs/common";
import { ExamQuestionService } from "./exam-question.service";
import { ExamQuestionController } from "./exam-question.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamReviewRoom, ExamQuestion, ExamSchedule } from "src/models";

@Module({
  imports: [
    SequelizeModule.forFeature([ExamQuestion, ExamReviewRoom, ExamSchedule]),
  ],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
