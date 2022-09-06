import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import {
  AuthUserRequestDto,
  CreateCreateExamMentoringRoomRequestDto,
  CreateExamMentoringRoomDto,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { ExamMentoringRoomService } from "./exam-mentoring-room.service";
import { Response } from "express";

@Controller("exam-mentoring-room")
export class ExamMentoringRoomController {
  constructor(
    private readonly examMentoringRoomService: ExamMentoringRoomService,
    private readonly OauthService: OauthService
  ) {}

  @Get()
  async getExamMentoringRoomListByExamScheduleId(
    @Query("examScheduleId") examScheduleId: number
  ) {
    const examMentoringRoomList =
      await this.examMentoringRoomService.getExamMentoringRoomByExamScheduleId(
        examScheduleId
      );

    return {
      message: "OK",
      examMentoringRoomList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamMentoringRoom(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateExamMentoringRoomDto
  ) {
    const [target, isCreated] =
      await this.examMentoringRoomService.createExamMentoringRoom(body);

    return {
      message: `received ${body}`,
      examMentoringRoom: target,
      isCreated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createExamMentoringRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateCreateExamMentoringRoomRequestDto
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);

    await this.examMentoringRoomService.createExamMentoringRoomRequest(
      userData,
      body
    );

    return {
      message: "OK",
    };
  }

  @Get("/create-request")
  async getCreateExamMentoringRoomRequestList(
    @Query("examScheduleId") examScheduleId: number
  ) {
    const requestList =
      await this.examMentoringRoomService.getCreateExamMentoringRoomRequestList(
        {
          examScheduleId,
        }
      );

    console.log("requestList", requestList);

    return {
      message: `${examScheduleId} requestList`,
      requestList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/create-request")
  async deleteExamMentoringRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);

    console.log(
      "userData",
      userData,
      "examScheduleId",
      examScheduleId,
      "examField",
      examField
    );
    const requestList =
      await this.examMentoringRoomService.deleteExamMentoringRoomRequest(
        userData,
        examScheduleId,
        examField
      );

    return {
      message: `${examScheduleId} requestList`,
      data: requestList,
    };
  }

  @Get("/pdfExam")
  async exam(@Res() res: Response) {
    const buffer = await this.examMentoringRoomService.generatePDF();
    console.log("123");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=example.pdf",
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }
}
