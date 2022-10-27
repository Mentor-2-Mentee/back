import { Module } from "@nestjs/common";
import { ExamQuestionCommentService } from "./exam-question-comment.service";
import { ExamQuestionCommentController } from "./exam-question-comment.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamQuestionComment, User } from "src/models";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([ExamQuestionComment, User]),
  ],
  controllers: [ExamQuestionCommentController],
  providers: [ExamQuestionCommentService],
})
export class ExamQuestionCommentModule {}
