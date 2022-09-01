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
  Put,
  Res,
  Req,
} from "@nestjs/common";
import { TestScheduleService } from "./test-schedule.service";
import { OauthService } from "src/oauth/oauth.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  AuthUserRequestDto,
  CreateTestScheduleDto,
  UpdateTestScheduleDto,
} from "src/models";
import { Response } from "express";

const MAX_IMAGE_COUNT = 10;

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

    if (!startDate_YYYY_MM_DD || !endDate_YYYY_MM_DD) {
      throw new BadRequestException("bad request");
    }

    const searchList =
      await this.testScheduleService.findTestScheduleByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

    return {
      testScheduleList: searchList,
    };
  }

  @Get(":testScheduleId")
  async getScheduleById(@Param("testScheduleId") testScheduleId: number) {
    console.log(testScheduleId);
    const targetTestSchedule =
      await this.testScheduleService.findTestScheduleById(testScheduleId);

    console.log({
      message: `${testScheduleId} data`,
      testScheduleList: targetTestSchedule,
    });

    return {
      message: `${testScheduleId} data`,
      testScheduleList: targetTestSchedule,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async createTestSchedule(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateTestScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    const savedTestSchedule = await this.testScheduleService.createTestSchedule(
      userData,
      body,
      files
    );

    return {
      message: `create ${body.testScheduleTitle} schedule success`,
      data: savedTestSchedule,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async update(
    @Req() request: AuthUserRequestDto,
    @Body() body: UpdateTestScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    await this.testScheduleService.updateTestSchedule(userData, body, files);

    return {
      message: `update ${body.testScheduleTitle} schedule success`,
      data: body,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteTestSchedule(
    @Req() request: AuthUserRequestDto,
    @Query("testScheduleId") testScheduleId: string
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    await this.testScheduleService.deleteTestSchedule(
      userData,
      Number(testScheduleId)
    );

    console.log(testScheduleId);

    return {
      message: `delete ${testScheduleId} schedule success`,
      data: testScheduleId,
    };
  }

  @Get("/test")
  async test(@Res() res: Response) {
    const buffer = await this.testScheduleService.generatePDF();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=example.pdf",
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }
}
