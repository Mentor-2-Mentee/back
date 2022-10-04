import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthUserRequestDto, CreateQuestionDto } from "src/models";
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

  @Get()
  async findQuestionPost() {
    const result = await this.questionPostService.findQuestionPost();
    return {
      message: "OK",
      questionPost: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNewQuestion(
    @Req() request: AuthUserRequestDto,
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

    const { questionId } =
      body.questionForm.uploadType === "TEXT"
        ? await this.questionService.createNewQuestionByText(createQuestionDto)
        : await this.questionService.createNewQuestionByImage(
            createQuestionDto
          );

    const createQuestionPostDto: CreateQuestionPostDto = {
      questionId,
      author: request.user.username,
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
