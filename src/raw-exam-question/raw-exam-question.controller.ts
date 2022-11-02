import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizeUserProfile } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { RawExamQuestionService } from "./raw-exam-question.service";

@Controller("raw-exam-question")
export class RawExamQuestionController {
  constructor(
    private readonly rawExamQuestionService: RawExamQuestionService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveRawExamQuestion(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: any
  ) {
    console.log("raw exam question", body);
    const isSaved = await this.rawExamQuestionService.saveRawExamQuestion(
      user.id,
      body.examQuestionId,
      body.questionText,
      body.solution
    );
    return {
      massage: "OK",
      isSaved,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateRawExamQuestion(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: any
  ) {
    console.log("raw exam question", body);

    return {
      body,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteRawExamQuestion(
    @Req() { user }: AuthorizeUserProfile,
    @Body() body: any
  ) {
    console.log("raw exam question", body);

    return {
      body,
    };
  }
}
