import { Delete, Put, Query } from "@nestjs/common";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthorizeUserProfile, UpdateQuestionPostDto } from "src/models";
import { CreateQuestionPostDto } from "src/models/dto/create-questionPost.dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { QuestionService } from "src/question/question.service";
import { QuestionPostService } from "./question-post.service";

@Controller("question-post")
export class QuestionPostController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly questionPostService: QuestionPostService,
    private readonly questionService: QuestionService
  ) {}

  @Get("/list")
  async findQuestionPostList(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("filter") filter: string
  ) {
    const querys = {
      page: Number(page),
      limit: Number(limit),
      filter: JSON.parse(filter),
    };
    const result = await this.questionPostService.findQuestionPostList(querys);
    return {
      message: "OK",
      questionPost: result,
    };
  }

  @Get()
  async findQuestionPostOneById(@Query("postId") postId: number) {
    const result = await this.questionPostService.findQuestionPostOneById(
      postId
    );
    return {
      message: "OK",
      questionPost: result,
    };
  }

  @Get("/max-page")
  async getQuestionPostMaxPage(@Query("limit") limit: string) {
    const maxPage = await this.questionPostService.getQuestionPostMaxPage(
      Number(limit)
    );
    return {
      message: "OK",
      maxPage,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewQuestionPost(
    @Req() { user }: AuthorizeUserProfile,
    @Req() req: Request,
    @Body() body: CreateQuestionPostDto
  ) {
    const ip = String(
      req.headers["x-forwarded-for"] || req.socket.remoteAddress
    );
    console.log("POST /question", ip, body, user);

    const question = await this.questionService.createNewQuestion(
      body.questionForm
    );

    if (!user) {
      const questionPost =
        await this.questionPostService.createQuestionPostByGuest(
          question.id,
          body,
          ip
        );
      return {
        message: "등록성공",
        questionPostId: questionPost.id,
      };
    }

    const questionPost = await this.questionPostService.createQuestionPost(
      user.id,
      question.id,
      body
    );

    return {
      message: "등록성공",
      questionPostId: questionPost.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateQuestionPost(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: UpdateQuestionPostDto
  ) {
    const isUpdate = await this.questionPostService.updatePost(user.id, body);

    return {
      message: "OK",
      questionPostId: body.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteQuestionPost(
    @Req() { user }: AuthorizeUserProfile,
    @Query("questionPostId") questionPostId: number
  ) {
    const isDelete = await this.questionPostService.deletePost(
      user.id,
      questionPostId
    );
    if (!isDelete) {
      return { message: "삭제실패" };
    }
    return {
      message: "삭제되었습니다",
    };
  }
}
