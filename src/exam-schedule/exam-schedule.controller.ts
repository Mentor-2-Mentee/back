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
import { ExamScheduleService } from "./exam-schedule.service";
import { OauthService } from "src/oauth/oauth.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  AuthUserRequestDto,
  CreateExamScheduleDto,
  UpdateExamScheduleDto,
} from "src/models";
import { Response } from "express";

const MAX_IMAGE_COUNT = 10;

@Controller("examSchedule")
export class ExamScheduleController {
  constructor(
    private readonly examScheduleService: ExamScheduleService,
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
      await this.examScheduleService.findExamScheduleByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

    return {
      examScheduleList: searchList,
    };
  }

  @Get(":examScheduleId")
  async getScheduleById(@Param("examScheduleId") examScheduleId: number) {
    console.log(examScheduleId);
    const targetExamSchedule =
      await this.examScheduleService.findExamScheduleById(examScheduleId);

    console.log({
      message: `${examScheduleId} data`,
      examSchedule: targetExamSchedule,
    });

    return {
      message: `${examScheduleId} data`,
      examSchedule: targetExamSchedule,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async createExamSchedule(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateExamScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    const savedExamSchedule = await this.examScheduleService.createExamSchedule(
      userData,
      body,
      files
    );

    return {
      message: `create ${body.examScheduleTitle} schedule success`,
      data: savedExamSchedule,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async update(
    @Req() request: AuthUserRequestDto,
    @Body() body: UpdateExamScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    await this.examScheduleService.updateExamSchedule(userData, body, files);

    return {
      message: `update ${body.examScheduleTitle} schedule success`,
      data: body,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteExamSchedule(
    @Req() request: AuthUserRequestDto,
    @Query("examScheduleId") examScheduleId: string
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    await this.examScheduleService.deleteExamSchedule(
      userData,
      Number(examScheduleId)
    );

    console.log(examScheduleId);

    return {
      message: `delete ${examScheduleId} schedule success`,
      data: examScheduleId,
    };
  }
}
