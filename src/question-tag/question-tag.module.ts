import { Module } from "@nestjs/common";
import { QuestionTagService } from "./question-tag.service";
import { QuestionTagController } from "./question-tag.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { OauthModule } from "src/oauth/oauth.module";
import { QuestionTag } from "src/models";

@Module({
  imports: [OauthModule, SequelizeModule.forFeature([QuestionTag])],
  controllers: [QuestionTagController],
  providers: [QuestionTagService],
})
export class QuestionTagModule {}
