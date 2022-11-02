import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Put,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import configuration from "src/common/config/configuration";
import { AuthorizeUserProfile } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamQuestionService } from "./exam-question.service";

@Controller("exam-question")
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createExamQuestion() {}

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
  @Post("/question-image")
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Req() request: AuthorizeUserProfile,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log("POST /question-image", body, file.filename);

    const rootDirName = new RegExp("public/");
    const savedPath = file.path.replace(rootDirName, "");

    return {
      message: "OK",
      imageUrl: `${configuration().apiServerBaseURL}/${savedPath}`,
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
