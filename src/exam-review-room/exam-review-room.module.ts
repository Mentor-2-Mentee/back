import { Module } from "@nestjs/common";
import { ExamReviewRoomService } from "./exam-review-room.service";
import { ExamReviewRoomController } from "./exam-review-room.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { CreateExamReviewRoomRequest } from "src/models/entities/createExamReviewRoomRequest.entity";
import { ExamReviewRoom } from "src/models";
import { ExamQuestionModule } from "src/exam-question/exam-question.module";

@Module({
  imports: [
    ExamQuestionModule,
    SequelizeModule.forFeature([CreateExamReviewRoomRequest, ExamReviewRoom]),
  ],
  controllers: [ExamReviewRoomController],
  providers: [ExamReviewRoomService],
  exports: [ExamReviewRoomService],
})
export class ExamReviewRoomModule {}
