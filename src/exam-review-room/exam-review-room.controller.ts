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
  CreateCreateExamReviewRoomRequestDto,
  CreateExamReviewRoomDto,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { ExamReviewRoomService } from "./exam-review-room.service";
import { Response } from "express";

@Controller("exam-review-room")
export class ExamReviewRoomController {
  constructor(
    private readonly examReviewRoomService: ExamReviewRoomService,
    private readonly OauthService: OauthService
  ) {}

  @Get()
  async findExamReviewRoomListByExamScheduleId(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string
  ) {
    console.log(
      "findExamReviewRoomListByExamScheduleId",
      examScheduleId,
      examField
    );
    const examReviewRoomList =
      await this.examReviewRoomService.findExamReviewRoomList(examScheduleId);

    if (examField !== undefined) {
      const target = examReviewRoomList.find(
        (examReviewRoom) => examReviewRoom.examField === examField
      );
      return {
        message: `find ${examField}`,
        examReviewRoom: target,
      };
    }

    console.log("examReviewRoomList", examReviewRoomList);

    return {
      message: "OK",
      examReviewRoomList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("userInfo")
  async findUserInfoById(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string
  ) {
    const { userList } = await this.examReviewRoomService.findExamReviewRoomOne(
      examScheduleId,
      examField
    );
    const userInfoList = [];

    for (const userId of userList) {
      // const userInfo = await this.OauthService.getProfile(userId);
      // userInfoList.push(userInfo);
    }

    return {
      message: `${examScheduleId}-${examField} userInfoList`,
      userInfoList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamReviewRoom(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateExamReviewRoomDto
  ) {
    const [target, isCreated] =
      await this.examReviewRoomService.createExamReviewRoom(body);

    return {
      message: `received ${body}`,
      examReviewRoom: target,
      isCreated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createExamReviewRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateCreateExamReviewRoomRequestDto
  ) {
    // const userData = await this.OauthService.getProfile(request.user.id);

    // await this.examReviewRoomService.createExamReviewRoomRequest(
    //   userData,
    //   body
    // );

    return {
      message: "OK",
    };
  }

  @Get("/create-request")
  async getCreateExamReviewRoomRequestList(
    @Query("examScheduleId") examScheduleId: number
  ) {
    const requestList =
      await this.examReviewRoomService.getCreateExamReviewRoomRequestList({
        examScheduleId,
      });

    console.log("requestList", requestList);

    return {
      message: `${examScheduleId} requestList`,
      requestList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/create-request")
  async cancelExamReviewRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string
  ) {
    // const userData = await this.OauthService.getProfile(request.user.id);
    // const requestList =
    //   await this.examReviewRoomService.deleteExamReviewRoomRequest(
    //     userData,
    //     examScheduleId,
    //     examField
    //   );
    // return {
    //   message: `${examScheduleId} requestList`,
    //   data: requestList,
    // };
  }

  @Get("/question-pdf")
  async questionPdf(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string,
    @Res() res: Response
  ) {
    const targetRoomData =
      await this.examReviewRoomService.findExamReviewRoomOne(
        examScheduleId,
        examField
      );

    const buffer = await this.examReviewRoomService.generateQuestionPDF(
      targetRoomData,
      targetRoomData.examQuestionList
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=example.pdf",
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }

  @Get("/solution-pdf")
  async solutionPdf(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examField") examField: string,
    @Res() res: Response
  ) {
    const targetRoomData =
      await this.examReviewRoomService.findExamReviewRoomOne(
        examScheduleId,
        examField
      );

    const buffer = await this.examReviewRoomService.generateSolutionPDF(
      targetRoomData,
      targetRoomData.examQuestionList
    );

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=example.pdf",
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  }
}
