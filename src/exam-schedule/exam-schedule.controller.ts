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
  Put,
  Req,
} from "@nestjs/common";
import { ExamScheduleService } from "./exam-schedule.service";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import {
  AuthorizeUserProfile,
  CreateExamScheduleDto,
  UpdateExamScheduleDto,
} from "src/models";

@Controller("exam-schedule")
export class ExamScheduleController {
  constructor(private readonly examScheduleService: ExamScheduleService) {}

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
    const targetExamSchedule =
      await this.examScheduleService.findExamScheduleById(examScheduleId);

    console.log(targetExamSchedule);

    return {
      message: `${examScheduleId} data`,
      examSchedule: targetExamSchedule,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamSchedule(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: CreateExamScheduleDto
  ) {
    if (user.userGrade === "user") {
      return "permission denied";
    }

    const savedExamSchedule = await this.examScheduleService.createExamSchedule(
      body
    );

    return {
      message: `${body.organizer} 일정이 생성되었습니다.`,
      examScheduleId: savedExamSchedule.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: UpdateExamScheduleDto
  ) {
    if (user.userGrade === "user") {
      return "permission denied";
    }

    console.log("body", body);

    const isUpdate = await this.examScheduleService.updateExamSchedule(body);

    return {
      message: `${body.organizer} 일정이 수정되었습니다.`,
      examScheduleId: body.id,
      isUpdate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteExamSchedule(
    @Req() { user }: AuthorizeUserProfile,
    @Query("examScheduleId") examScheduleId: string
  ) {
    if (user.userGrade === "user") {
      return "permission denied";
    }

    const targetOrganizer = await this.examScheduleService.deleteExamSchedule(
      Number(examScheduleId)
    );
    return {
      message: `${targetOrganizer} 시험일정이 삭제되었습니다`,
    };
  }
}
