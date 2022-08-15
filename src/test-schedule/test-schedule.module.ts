import { Module } from "@nestjs/common";
import { TestScheduleService } from "./test-schedule.service";
import { TestScheduleController } from "./test-schedule.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TestSchedule } from "src/models";
import { OauthModule } from "src/oauth/oauth.module";

@Module({
  imports: [OauthModule, SequelizeModule.forFeature([TestSchedule])],
  controllers: [TestScheduleController],
  providers: [TestScheduleService],
})
export class TestScheduleModule {}
