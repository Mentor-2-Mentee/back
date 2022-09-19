import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ExamMentoringRoomService } from "src/exam-mentoring-room/exam-mentoring-room.service";
import { AuthUserRequestDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { ExamQuestionService } from "./exam-question.service";

@Controller("exam-question")
export class ExamQuestionController {
  constructor(private readonly examQuestionService: ExamQuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/question-image")
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Req() request: AuthUserRequestDto,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log("POST /question-image", body, file.filename);

    const rootDirName = new RegExp("public/");
    const savedPath = file.path.replace(rootDirName, "");
    return {
      message: "OK",
      imageUrl: savedPath,
    };
  }
}
