import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TestScheduleService } from "./test-schedule.service";
import { CreateTestScheduleDto } from "./dto/create-test-schedule.dto";
import { UpdateTestScheduleDto } from "./dto/update-test-schedule.dto";
import { OauthService } from "src/oauth/oauth.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
// import { TestSchedule, TestScheduleMap } from "src/models";

interface TestSchedule {
  scheduleId: string;
  scheduleTitle: string;
  scheduledDate: Date;
}

type objectedMap = Array<[string, TestSchedule]>;

@Controller("testSchedule")
export class TestScheduleController {
  constructor(
    private readonly testScheduleService: TestScheduleService,
    private readonly OauthService: OauthService
  ) {}

  @Get()
  findAll(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    const parsedStartDate: Date = new Date(startDate);
    const parsedEndDate: Date = new Date(endDate);

    const testScheduleMap = new Map();
    testScheduleMap.set("2022-08-20", [
      {
        scheduleId: 1,
        scheduleTitle: "이날시험",
        scheduleDate: new Date(2022, 7, 20),
      },
    ]);
    testScheduleMap.set("2022-08-21", [
      {
        scheduleId: 2,
        scheduleTitle: "이날 재시험",
        scheduleDate: new Date(2022, 7, 21),
      },
      {
        scheduleId: 3,
        scheduleTitle: "새로운 시험",
        scheduleDate: new Date(2022, 7, 21),
      },
    ]);

    const testScheduleObjectEntries: objectedMap =
      Object.fromEntries(testScheduleMap);

    const result = {
      testScheduleObjectEntries: testScheduleObjectEntries,
    };
    console.log("result", result);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTestSchedule(
    @Request() req,
    @Body() createTestScheduleDto: CreateTestScheduleDto
  ) {
    const userData = await this.OauthService.getProfile(req.user);
    if (userData.userGrade === "user") {
      return "permission denied";
    }
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTestScheduleDto: UpdateTestScheduleDto
  ) {
    return this.testScheduleService.update(+id, updateTestScheduleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.testScheduleService.remove(+id);
  }
}
