import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { CreateQuestionTagDto } from "src/models/dto/create-questionTag.dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { QuestionTagService } from "./question-tag.service";

@Controller("question-tag")
export class QuestionTagController {
  constructor(
    private readonly questionTagService: QuestionTagService,
    private readonly OauthService: OauthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: CreateQuestionTagDto) {
    const userData = await this.OauthService.getProfile(req.user);
    console.log("/POST question-tag ", userData, body);

    if (userData.userGrade !== "master") {
      return "닌 만들자격이 업따";
    }

    const result = await this.questionTagService.createTag(body);

    return "ok";
  }

  @Get()
  async getAllTags() {
    const result = await this.questionTagService.findAllTags();
    console.log(result);
    return {
      data: result,
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.questionTagService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateQuestionTagDto: any) {
    return this.questionTagService.update(+id, updateQuestionTagDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.questionTagService.remove(+id);
  }
}
