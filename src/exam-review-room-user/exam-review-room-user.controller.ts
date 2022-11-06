import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  AuthorizeUserProfile,
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

    return {
      message: `${updatedUserInfo.userProfile.userName}의 권한이 ${updatedUserInfo.userPosition}로 수정되었습니다`,
    };
  }
}
