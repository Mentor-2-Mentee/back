import { Module } from "@nestjs/common";
import { PostCommentService } from "./post-comment.service";
import { PostCommentController } from "./post-comment.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { QuestionPost, User } from "src/models";
import { PostComment } from "src/models/entities/postComment.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([PostComment, QuestionPost, User]),
  ],
  controllers: [PostCommentController],
  providers: [PostCommentService],
})
export class PostCommentModule {}
