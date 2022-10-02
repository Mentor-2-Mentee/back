import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthUserRequestDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { QuestionService } from "./question.service";

@Controller("question")
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly OauthService: OauthService
  ) {}

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
      body.questionForm.question.questionImageUrl
    );

    return {
      message: "now api testing...",
      url: "testUrl",
    };
  }
}
