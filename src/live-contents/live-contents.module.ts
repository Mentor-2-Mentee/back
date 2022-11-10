import { Module } from "@nestjs/common";
import { LiveContentsService } from "./live-contents.service";
import { LiveContentsGateway } from "./live-contents.gateway";
import { ExamQuestionModule } from "src/exam-question/exam-question.module";
import { ExamReviewRoomModule } from "src/exam-review-room/exam-review-room.module";
import { ExamReviewRoomChatModule } from "src/exam-review-room-chat/exam-review-room-chat.module";

@Module({
  imports: [ExamQuestionModule, ExamReviewRoomModule, ExamReviewRoomChatModule],
  providers: [LiveContentsGateway, LiveContentsService],
})
export class LiveContentsModule {}
