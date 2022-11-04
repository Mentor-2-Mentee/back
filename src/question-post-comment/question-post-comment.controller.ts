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
import { AuthorizeUserProfile, CreatePostCommentDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { QuestionPostCommentService } from "./question-post-comment.service";
@Controller("question-post-comment")
export class QuestionPostCommentController {
  constructor(
    private readonly postCommentService: QuestionPostCommentService
  ) {}

  @Get()
  async findPostCommentListByPostId(
    @Query("questionPostId") questionPostId: number
  ) {
    const commentList = await this.postCommentService.findCommentListByPostId(
      questionPostId
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
    @Body() body: CreatePostCommentDto
  ) {
    console.log("comment", body.comment);
    const isCreate = this.postCommentService.createComment(
      user.id,
      body.questionPostId,
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
    const isDelete = await this.postCommentService.deleteComment(
      user.id,
      commentId
    );

    return {
      message: "삭제되었습니다",
      isDelete,
    };
  }
}
