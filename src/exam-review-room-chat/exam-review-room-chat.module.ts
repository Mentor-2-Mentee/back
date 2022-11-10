import { Module } from "@nestjs/common";
import { ExamReviewRoomChatService } from "./exam-review-room-chat.service";
import { ExamReviewRoomChatController } from "./exam-review-room-chat.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamReviewRoom, ExamReviewRoomChat } from "src/models";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([ExamReviewRoomChat, ExamReviewRoom]),
  ],
  controllers: [ExamReviewRoomChatController],
  providers: [ExamReviewRoomChatService],
  exports: [ExamReviewRoomChatService],
})
export class ExamReviewRoomChatModule {}
