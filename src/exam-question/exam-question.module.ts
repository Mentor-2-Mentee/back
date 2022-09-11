import { Module } from "@nestjs/common";
import { ExamQuestionService } from "./exam-question.service";
import { ExamQuestionController } from "./exam-question.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamQuestion } from "src/models";

@Module({
  imports: [OauthModule, SequelizeModule.forFeature([ExamQuestion])],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
