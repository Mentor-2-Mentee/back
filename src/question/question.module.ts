import { Module } from "@nestjs/common";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [OauthModule, SequelizeModule.forFeature([])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
