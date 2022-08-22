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
import {
  CreateCreateTestMentoringRoomRequestDto,
  GetCreateTestMentoringRoomRequest,
  User,
} from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { OauthService } from "src/oauth/oauth.service";
import { TestMentoringRoomService } from "./test-mentoring-room.service";

@Controller("test-mentoring-room")
export class TestMentoringRoomController {
  constructor(
    private readonly testMentoringRoomService: TestMentoringRoomService,
    private readonly OauthService: OauthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createTestMentoringRoomRequest(
    @Request() req,
    @Body() body: CreateCreateTestMentoringRoomRequestDto
  ) {
    const userData = await this.OauthService.getProfile(req.user);
    console.log(userData, body);

    await this.testMentoringRoomService.createTestMentoringRoomRequest(
      userData,
      body
    );

    return {
      message: "OK",
    };
  }

  @Get("/create-request")
  async getCreateTestMentoringRoomRequestList(
    @Query("testScheduleId") testScheduleId: number
  ) {
    console.log("testScheduleId", testScheduleId);
    const requestList =
      await this.testMentoringRoomService.getCreateTestMentoringRoomRequestList(
        {
          testScheduleId,
        }
      );

    return {
      message: `${testScheduleId} requestList`,
      data: requestList,
    };
  }
}
