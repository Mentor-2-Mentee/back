import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  Put,
  Req,
} from "@nestjs/common";
import { ExamScheduleService } from "./exam-schedule.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  AuthorizeUserProfile,
  CreateExamScheduleDto,
  UpdateExamScheduleDto,
} from "src/models";
import { UserProfileService } from "src/user-profile/user-profile.service";

const MAX_IMAGE_COUNT = 10;

@Controller("exam-schedule")
export class ExamScheduleController {
  constructor(
    private readonly examScheduleService: ExamScheduleService,
    private readonly userProfileService: UserProfileService
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
    @Req() request: AuthorizeUserProfile,
    @Body() body: CreateExamScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    const savedExamSchedule = await this.examScheduleService.createExamSchedule(
      userData,
      body,
      files
    );

    return {
      message: `${body.examScheduleTitle} 일정이 생성되었습니다.`,
      examScheduleId: savedExamSchedule.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async update(
    @Req() request: AuthorizeUserProfile,
    @Body() body: UpdateExamScheduleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    await this.examScheduleService.updateExamSchedule(userData, body, files);

    return {
      message: `${body.examScheduleTitle} 일정이 수정되었습니다.`,
      examScheduleId: body.examScheduleId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteExamSchedule(
    @Req() request: AuthorizeUserProfile,
    @Query("examScheduleId") examScheduleId: string
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    if (userData.userGrade === "user") {
      return "permission denied";
    }

    const deletedExamScheduleTitle =
      await this.examScheduleService.deleteExamSchedule(
        userData,
        Number(examScheduleId)
      );
    return {
      message: `${deletedExamScheduleTitle} 시험일정이 삭제되었습니다`,
    };
  }
}
