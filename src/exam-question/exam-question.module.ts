import { Module } from "@nestjs/common";
import { ExamQuestionService } from "./exam-question.service";
import { ExamQuestionController } from "./exam-question.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamMentoringRoom, ExamQuestion } from "src/models";
import { ExamMentoringRoomModule } from "src/exam-mentoring-room/exam-mentoring-room.module";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([ExamQuestion, ExamMentoringRoom]),
  ],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
