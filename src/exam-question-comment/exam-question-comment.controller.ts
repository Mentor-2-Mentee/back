import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizeUserProfile, CreateExamQuestionCommentDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamQuestionCommentService } from "./exam-question-comment.service";

@Controller("exam-question-comment")
export class ExamQuestionCommentController {
  constructor(
    private readonly examQuestionCommentService: ExamQuestionCommentService
  ) {}

  @Get()
  async findCommentListByExamQuestionId(
    @Query("examQuestionId") examQuestionId: number
  ) {
    const commentList =
      await this.examQuestionCommentService.findCommentListByExamQuestionId(
        examQuestionId
      );
    return {
      message: "OK",
      commentList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: CreateExamQuestionCommentDto
  ) {
    console.log("examComment", body.comment);
    const isCreate = this.examQuestionCommentService.createComment(
      user.id,
      body.examQuestionId,
      body.comment,
      body.commentLevel,
      body.parentCommentId
    );

    return {
      message: "OK",
      isCreate,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(
    @Req() { user }: AuthorizeUserProfile,
    @Query("commentId") commentId: number
  ) {
    console.log("delete comment id", commentId);
    const isDelete = await this.examQuestionCommentService.deleteComment(
      user.id,
      commentId
    );

    return {
      message: "삭제되었습니다",
      isDelete,
    };
  }
}
