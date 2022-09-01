import { Module } from "@nestjs/common";
import { TestMentoringRoomService } from "./test-mentoring-room.service";
import { TestMentoringRoomController } from "./test-mentoring-room.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { CreateTestMentoringRoomRequest } from "src/models/entities/createTestMentoringRoomRequest.entity";
import { TestMentoringRoom } from "src/models";

@Module({
  imports: [
    OauthModule,
    SequelizeModule.forFeature([
      CreateTestMentoringRoomRequest,
      TestMentoringRoom,
    ]),
  ],
  controllers: [TestMentoringRoomController],
  providers: [TestMentoringRoomService],
})
export class TestMentoringRoomModule {}
