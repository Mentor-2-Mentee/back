import {
  Controller,
  Request,
  UseGuards,
  Get,
  Put,
  Query,
  Body,
} from "@nestjs/common";
import { AuthUserRequestDto, UpdateUserProfileDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { UserProfileService } from "./user-profile.service";

@Controller("user-profile")
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findUserProfileOne(@Request() { user }: AuthUserRequestDto) {
    const userProfile = await this.userProfileService.findUserProfileById(
      user.id
    );
    return {
      message: "OK",
      userProfile,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserProfileOne(
    @Request() { user }: AuthUserRequestDto,
    @Body() body: UpdateUserProfileDto
  ) {
    const userProfile = await this.userProfileService.updateUserProfile(
      user.id,
      body
    );
    return {
      message: "OK",
      userProfile,
    };
  }

  @Get("/name-check")
  async getCheckResult(@Query("newname") newName: string) {
    return this.userProfileService.checkUseableName(newName);
  }
}
