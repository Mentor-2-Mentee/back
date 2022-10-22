import { Query } from "@nestjs/common";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizeUserProfile, CreateQuestionDto } from "src/models";
import { CreateQuestionPostDto } from "src/models/dto/create-questionPost.dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { QuestionService } from "src/question/question.service";
import { QuestionPostService } from "./question-post.service";

@Controller("question-post")
export class QuestionPostController {
  constructor(
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
    console.log("querys", querys);
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
  async createNewQuestion(
    @Req() request: AuthorizeUserProfile,
    @Body() body: any
  ) {
    console.log(
      "POST /question",
      request.user,
      body,
      body.questionForm.question
    );

    const createQuestionDto: CreateQuestionDto = {
      ...body.questionForm.question,
    };

    console.log("question등록", body.questionForm.question);
    const { id } =
      body.questionForm.uploadType === "TEXT"
        ? await this.questionService.createNewQuestionByText(createQuestionDto)
        : await this.questionService.createNewQuestionByImage(
            createQuestionDto
          );

    console.log("questionId생성", id);

    const createQuestionPostDto: CreateQuestionPostDto = {
      questionId: id,
      authorId: String(request.user.id),
      questionPostTitle: body.questionForm.questionPostTitle,
      questionPostDescription: body.questionForm.questionPostDescription,
    };

    const { questionPostId } =
      await this.questionPostService.createQuestionPost(createQuestionPostDto);

    return {
      message: "now api testing...",
      path: `testPath ${questionPostId}`,
    };
  }
}
