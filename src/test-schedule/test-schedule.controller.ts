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
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { TestScheduleService } from "./test-schedule.service";
import { OauthService } from "src/oauth/oauth.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateTestScheduleDto } from "src/models";

const MAX_IMAGE_COUNT = 5;

@Controller("testSchedule")
export class TestScheduleController {
  constructor(
    private readonly testScheduleService: TestScheduleService,
    private readonly OauthService: OauthService
  ) {}

  @Get()
  async getScheduleByDateRange(
    @Query("startDate") startDate: string, //
    @Query("endDate") endDate: string
  ) {
    const YYYY_MM_DD_regExp = /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/;
    const startDate_YYYY_MM_DD = YYYY_MM_DD_regExp.exec(startDate);
    const endDate_YYYY_MM_DD = YYYY_MM_DD_regExp.exec(endDate);

    console.log(startDate_YYYY_MM_DD, endDate_YYYY_MM_DD);
    if (!startDate_YYYY_MM_DD || !endDate_YYYY_MM_DD) {
      throw new BadRequestException("bad request");
    }

    const searchList =
      await this.testScheduleService.findTestScheduleByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

    console.log("searchList", searchList);

    const testScheduleList = [
      {
        scheduleId: 1,
        scheduleTitle: "남동필기",
        scheduledDate: "2022-08-20",
        testField: "채용",
        // testDescription: "남동발전 시험",
        imageFiles: ["https://molru"],
      },
      {
        scheduleId: 2,
        scheduleTitle: "동서필기",
        scheduledDate: "2022-08-25",
        testField: "채용",
        // testDescription: "동서발전 시험",
        imageFiles: ["https://molru"],
      },
      {
        scheduleId: 3,
        scheduleTitle: "기사 3차필기",
        scheduledDate: "2022-08-25",
        testField: "자격증",
        // testDescription: "기사자격증 3차 시험",
        imageFiles: ["https://molru"],
      },
    ];

    return {
      testScheduleList: searchList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async createTestSchedule(
    @Request() req,
    @Body() body: CreateTestScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.OauthService.getProfile(req.user);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    console.log(body);

    const result = await this.testScheduleService.createTestSchedule(
      userData,
      body,
      files
    );

    return `received ${result}`;
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTestScheduleDto: any) {
    return this.testScheduleService.update(+id, updateTestScheduleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.testScheduleService.remove(+id);
  }
}
