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
import { Request } from "express";

@Controller("exam-question-comment")
export class ExamQuestionCommentController {
  constructor(
    private readonly examQuestionCommentService: ExamQuestionCommentService
  ) {}

  @Get()
  async findCommentListByExamQuestionId(
    @Query("examQuestionId") examQuestionId: string
  ) {
    const commentList =
      await this.examQuestionCommentService.findCommentListByExamQuestionId(
        Number(examQuestionId)
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
    @Query("commentId") commentId: string
  ) {
    const isDelete = await this.examQuestionCommentService.deleteComment(
      user.id,
      Number(commentId)
    );

    return {
      message: "삭제되었습니다",
      isDelete,
    };
  }
}
