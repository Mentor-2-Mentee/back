import { Module } from "@nestjs/common";
import { ExamReviewRoomUserService } from "./exam-review-room-user.service";
import { ExamReviewRoomUserController } from "./exam-review-room-user.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamReviewRoomUser } from "src/models";

@Module({
  imports: [SequelizeModule.forFeature([ExamReviewRoomUser])],
  controllers: [ExamReviewRoomUserController],
  providers: [ExamReviewRoomUserService],
})
export class ExamReviewRoomUserModule {}
