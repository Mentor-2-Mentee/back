import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Put,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthorizeUserProfile } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamQuestionService } from "./exam-question.service";

@Controller("exam-question")
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/set-question-count")
  async setExamQuestionCount(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: any
  ) {
    if (user.userGrade === "user")
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);

    const isCreate = await this.examQuestionService.setExamQuestionCount(
      body.examReviewRoomId,
      body.examQuestionCount
    );

    return {
      message: `${body.examQuestionCount}개로 조정`,
      isCreate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateExamQuestion(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: any
  ) {
    console.log("update exam question", body);
    if (user.userGrade === "user")
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);
    const isUpdate = this.examQuestionService.updateQuestion(body);

    return {
      message: "OK",
      isUpdate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("/list")
  async findExamQuestionList(
    @Req() { user }: AuthorizeUserProfile,
    @Query("examReviewRoomId") examReviewRoomId: number
  ) {
    const examQuestionIdList =
      await this.examQuestionService.findExamQuestionIdListByRoomId(
        examReviewRoomId
      );
    const examQuestionList =
      await this.examQuestionService.findExamQuestionListByQuestionId(
        examQuestionIdList
      );

    return {
      message: `${examReviewRoomId} questions`,
      examQuestionList,
    };
  }
}
