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
  HttpException,
  HttpStatus,
  Put,
} from "@nestjs/common";
import {
  AuthorizeUserProfile,
  CreateCreateExamReviewRoomRequestDto,
  CreateExamReviewRoomDto,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamReviewRoomService } from "./exam-review-room.service";
import { Response } from "express";
import { UserProfileService } from "src/user-profile/user-profile.service";

@Controller("exam-review-room")
export class ExamReviewRoomController {
  constructor(
    private readonly examReviewRoomService: ExamReviewRoomService,
    private readonly userProfileService: UserProfileService
  ) {}

  @Get()
  async findExamReviewRoomHeadData(
    @Query("examReviewRoomId") examReviewRoomId: number
    // @Query("userId") userId: string
  ) {
    const data = await this.examReviewRoomService.findExamReviewRoomHeadData(
      examReviewRoomId
    );

    return {
      message: "organizer & examType",
      ...data,
    };
  }

  @Get("list")
  async findExamReviewRoomListByExamScheduleId(
    @Query("examScheduleId") examScheduleId: number,
    @Query("userId") userId: string
  ) {
    const examReviewRoomList =
      await this.examReviewRoomService.findExamReviewRoomList(
        examScheduleId,
        userId
      );

    return {
      message: "OK",
      examReviewRoomList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("userInfo")
  async findUserInfoById(
    @Query("examScheduleId") examScheduleId: number,
    @Query("examType") examType: string
  ) {
    // const { userList } = await this.examReviewRoomService.findExamReviewRoomOne(
    //   examScheduleId,
    //   examType
    // );
    const userInfoList = [];

    // for (const userId of userList) {
    //   // const userInfo = await this.OauthService.getProfile(userId);
    //   // userInfoList.push(userInfo);
    // }

    return {
      message: `${examScheduleId}-${examType} userInfoList`,
      userInfoList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamReviewRoom(
    @Req() { user }: AuthorizeUserProfile,
    @Body() { requestId }: CreateExamReviewRoomDto
  ) {
    const createdRoom = await this.examReviewRoomService.createExamReviewRoom(
      user.id,
      requestId
    );

    return {
      message: `${createdRoom.examType} 리뷰방 생성완료`,
      isCreated: true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createExamReviewRoomRequest(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: CreateCreateExamReviewRoomRequestDto
  ) {
    const [isCreated, message] =
      await this.examReviewRoomService.createExamReviewRoomRequest(
        user.id,
        body
      );

    if (!isCreated) {
      return { message };
    }

    return {
      message,
    };
  }

  @Get("/create-request")
  async getRequestList(
    @Query("examScheduleId") examScheduleId: number,
    @Query("userId") userId: string
  ) {
    console.log("userId", userId);

    const requestList = await this.examReviewRoomService.getRequestList(
      examScheduleId,
      userId
    );

    return {
      message: `${examScheduleId} requestList`,
      requestList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put("/create-request")
  async cancelExamReviewRoomRequest(
    @Req() { user }: AuthorizeUserProfile,
    @Query("requestId") requestId: number,
    @Query("examType") examType: string
  ) {
    const isCanceled = await this.examReviewRoomService.cancelRequest(
      user.id,
      requestId
    );
    return {
      message: `${examType} 신청 취소`,
      isCanceled,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/create-request")
  async deleteExamReviewRoomRequest(
    @Req() { user }: AuthorizeUserProfile,
    @Query("requestId") requestId: number,
    @Query("examType") examType: string
  ) {
    const isDeleted = await this.examReviewRoomService.deleteRequest(requestId);
    return {
      message: `${examType} 신청 삭제`,
      isDeleted,
    };
  }

  // @Get("/question-pdf")
  // async questionPdf(
  //   @Query("examScheduleId") examScheduleId: number,
  //   @Query("examType") examType: string,
  //   @Res() res: Response
  // ) {
  //   const targetRoomData =
  //     await this.examReviewRoomService.findExamReviewRoomOne(
  //       examScheduleId,
  //       examType
  //     );

  //   const buffer = await this.examReviewRoomService.generateQuestionPDF(
  //     targetRoomData,
  //     targetRoomData.examQuestionList
  //   );

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": "attachment; filename=example.pdf",
  //     "Content-Length": buffer.length,
  //   });

  //   res.end(buffer);
  // }

  // @Get("/solution-pdf")
  // async solutionPdf(
  //   @Query("examScheduleId") examScheduleId: number,
  //   @Query("examType") examType: string,
  //   @Res() res: Response
  // ) {
  //   const targetRoomData =
  //     await this.examReviewRoomService.findExamReviewRoomOne(
  //       examScheduleId,
  //       examType
  //     );

  //   const buffer = await this.examReviewRoomService.generateSolutionPDF(
  //     targetRoomData,
  //     targetRoomData.examQuestionList
  //   );

  //   res.set({
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": "attachment; filename=example.pdf",
  //     "Content-Length": buffer.length,
  //   });

  //   res.end(buffer);
  // }

  @UseGuards(JwtAuthGuard)
  @Post("/enter")
  async roomEnter(@Req() { user }: AuthorizeUserProfile, @Body() body: any) {
    const isEntered = await this.examReviewRoomService.enterRoom(
      user.id,
      body.enterUserType,
      body.examReviewRoomId
    );
    return {
      message: "enter",
      isEntered,
    };
  }
}
