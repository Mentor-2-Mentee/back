import { Module } from "@nestjs/common";
import { QuestionPostCommentService } from "./question-post-comment.service";
import { QuestionPostCommentController } from "./question-post-comment.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { QuestionPost, User } from "src/models";
import { QuestionPostComment } from "src/models/entities/questionPostComment.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([QuestionPostComment, QuestionPost, User]),
  ],
  controllers: [QuestionPostCommentController],
  providers: [QuestionPostCommentService],
})
export class QuestionPostCommentModule {}
