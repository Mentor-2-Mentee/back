import { Module } from "@nestjs/common";
import { ExamMentoringRoomService } from "./exam-mentoring-room.service";
import { ExamMentoringRoomController } from "./exam-mentoring-room.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { CreateExamMentoringRoomRequest } from "src/models/entities/createExamMentoringRoomRequest.entity";
import { ExamMentoringRoom } from "src/models";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([
      CreateExamMentoringRoomRequest,
      ExamMentoringRoom,
    ]),
  ],
  controllers: [ExamMentoringRoomController],
  providers: [ExamMentoringRoomService],
})
export class ExamMentoringRoomModule {}
