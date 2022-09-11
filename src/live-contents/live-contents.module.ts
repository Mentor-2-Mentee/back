import { Module } from "@nestjs/common";
import { LiveContentsService } from "./live-contents.service";
import { LiveContentsGateway } from "./live-contents.gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ExamQuestionModule } from "src/exam-question/exam-question.module";

@Module({
  imports: [ExamQuestionModule],
  providers: [LiveContentsGateway, LiveContentsService],
})
export class LiveChatModule {}
