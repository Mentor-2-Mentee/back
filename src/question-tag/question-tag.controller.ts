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
  Query,
} from "@nestjs/common";
import { CreateQuestionTagDto, DeleteQuestionTagDto } from "src/models/dto";
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
      return "permission denied";
    }

    const result = await this.questionTagService.createTag(body);

    return result;
  }

  @Get()
  async getAllTags() {
    const result = await this.questionTagService.findAllTags();
    console.log(result);
    return {
      data: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteTag(
    @Request() req,
    @Query("tagname") tagName: string,
    @Query("parentTag") parentTag: string
  ) {
    const userData = await this.OauthService.getProfile(req.user);
    console.log("/DELETE question-tag ", userData, tagName, parentTag);

    if (userData.userGrade !== "master") {
      return "permission denied";
    }

    if (parentTag === "undefined") {
      const result = await this.questionTagService.deleteParentsFamilyTag({
        tagName,
      });
      return result;
    }
    if (parentTag !== "undefined") {
      const result = await this.questionTagService.deleteChildTag({
        tagName,
        parentTag,
      });
      return result;
    }
  }
}
