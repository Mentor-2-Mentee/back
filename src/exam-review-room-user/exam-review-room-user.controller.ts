import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  AuthorizeUserProfile,
  CreateExamReviewRoomUserDto,
  UpdateExamReviewRoomUserPositionDto,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamReviewRoomUserService } from "./exam-review-room-user.service";

@Controller("exam-review-room-user")
export class ExamReviewRoomUserController {
  constructor(
    private readonly examReviewRoomUserService: ExamReviewRoomUserService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewUser(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: CreateExamReviewRoomUserDto
  ) {
    const isCreate = await this.examReviewRoomUserService.createNewUser(
      user.id,
      user.userGrade,
      body.examReviewRoomId,
      body.isParticipant
    );

    if (!isCreate)
      throw new HttpException("bad request", HttpStatus.BAD_REQUEST);

    return {
      message: "입장완료",
      examReviewRoomId: body.examReviewRoomId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCurrentUser(
    @Req() { user }: AuthorizeUserProfile,
    @Query("examReviewRoomId") examReviewRoomId: string,
    @Query("targetUserId") targetUserId: string
  ) {
    if (user.userGrade === "user")
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);

    const deletedUser = await this.examReviewRoomUserService.deleteRoomUser({
      examReviewRoomId: Number(examReviewRoomId),
      targetUserId,
    });

    const message =
      targetUserId === user.id
        ? "퇴장했습니다"
        : `${deletedUser.userProfile.userName}을 내보냈습니다.`;

    return {
      message,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("/list")
  async findAllExamReviewRoomUser(
    @Query("examReviewRoomId") examReviewRoomId: number
  ) {
    const userList =
      await this.examReviewRoomUserService.findAllExamReviewRoomUser(
        examReviewRoomId
      );

    return {
      message: `${examReviewRoomId} userList`,
      userList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put("/position")
  async updateRoomUserPosition(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: UpdateExamReviewRoomUserPositionDto
  ) {
    if (user.userGrade === "user")
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);
    const updatedUserInfo =
      await this.examReviewRoomUserService.updateRoomUserPosition(
        body.examReviewRoomId,
        body.targetUserId,
        body.newPosition
      );

    const message =
      updatedUserInfo.userPosition === "helper"
        ? `${updatedUserInfo.userProfile.userName} 도우미 지정`
        : `${updatedUserInfo.userProfile.userName} 도우미 해제`;

    return {
      message,
      newPosition: updatedUserInfo.userPosition,
    };
  }
}
