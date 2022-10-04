import { Module } from "@nestjs/common";
import { QuestionPostService } from "./question-post.service";
import { QuestionPostController } from "./question-post.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { QuestionPost } from "src/models";
import { QuestionModule } from "src/question/question.module";

@Module({
  imports: [
    OauthModule,
    QuestionModule,
    SequelizeModule.forFeature([QuestionPost]),
  ],
  controllers: [QuestionPostController],
  providers: [QuestionPostService],
})
export class QuestionPostModule {}
