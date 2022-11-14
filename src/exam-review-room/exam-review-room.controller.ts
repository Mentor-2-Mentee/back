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
  UpdateExamReviewRoomDto,
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
  @Put()
  async updateReviewRoomSetting(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: UpdateExamReviewRoomDto
  ) {
    console.log("body", body);
    const updateMessage =
      await this.examReviewRoomService.updateReviewRoomSetting(body);

    return {
      message: updateMessage,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteExamReviewRoom(
    @Req() { user }: AuthorizeUserProfile,
    @Query("examReviewRoomId") examReviewRoomId: string
  ) {
    if (user.userGrade === "user")
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);

    const isDeleted = await this.examReviewRoomService.deleteRoom(
      Number(examReviewRoomId)
    );

    return {
      message: "OK",
      isDeleted,
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
}
