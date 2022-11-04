import { Module } from "@nestjs/common";
import { ExamScheduleService } from "./exam-schedule.service";
import { ExamScheduleController } from "./exam-schedule.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamSchedule, ExamScheduleRelation } from "src/models";
import { UserProfileModule } from "src/user-profile/user-profile.module";

@Module({
  imports: [
    UserProfileModule,
    SequelizeModule.forFeature([ExamSchedule, ExamScheduleRelation]),
  ],
  controllers: [ExamScheduleController],
  providers: [ExamScheduleService],
})
export class ExamScheduleModule {}
