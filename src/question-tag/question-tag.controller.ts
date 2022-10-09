import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Query,
  Req,
} from "@nestjs/common";
import { AuthorizeUserProfile, CreateQuestionTagDto } from "src/models/dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { UserProfileService } from "src/user-profile/user-profile.service";
import { QuestionTagService } from "./question-tag.service";

@Controller("question-tag")
export class QuestionTagController {
  constructor(
    private readonly questionTagService: QuestionTagService,
    private readonly userProfileService: UserProfileService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() request: AuthorizeUserProfile,
    @Body() body: CreateQuestionTagDto
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    console.log("/POST question-tag ", userData, body);

    if (userData.userGrade !== "master") {
      return "permission denied";
    }

    const result = await this.questionTagService.createTag(body);

    if (!result) {
      return {
        message: "이미 존재하거나, 생성에 실패했습니다",
        result: false,
      };
    }
    return {
      message: `${result.tagName}이 생성되었습니다.`,
      result: true,
    };
  }

  @Get()
  async getAllTags() {
    const result = await this.questionTagService.findAllTags();
    return {
      message: "OK",
      questionTagList: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteTag(
    @Req() request: AuthorizeUserProfile,
    @Query("tagname") tagName: string,
    @Query("parentTag") parentTag: string
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    console.log("/DELETE question-tag ", userData, tagName, parentTag);

    if (userData.userGrade !== "master") {
      return "permission denied";
    }

    if (parentTag === "undefined") {
      await this.questionTagService.deleteParentsFamilyTag({
        tagName,
      });
      return {
        message: `${tagName} 및 하위태그들 삭제완료`,
      };
    }
    if (parentTag !== "undefined") {
      await this.questionTagService.deleteChildTag({
        tagName,
        parentTag,
      });
      return {
        message: `${parentTag} - ${tagName} 삭제완료`,
      };
    }
  }
}
