import { Module } from "@nestjs/common";
import { QuestionTagService } from "./question-tag.service";
import { QuestionTagController } from "./question-tag.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { QuestionTag } from "src/models";
import { UserProfileModule } from "src/user-profile/user-profile.module";

@Module({
  imports: [UserProfileModule, SequelizeModule.forFeature([QuestionTag])],
  controllers: [QuestionTagController],
  providers: [QuestionTagService],
})
export class QuestionTagModule {}
