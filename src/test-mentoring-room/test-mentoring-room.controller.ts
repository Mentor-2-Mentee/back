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
import {
  AuthUserRequestDto,
  CreateCreateTestMentoringRoomRequestDto,
  CreateTestMentoringRoomDto,
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

  @Get()
  async getTestMentoringRoomListByTestScheduleId(
    @Query("testScheduleId") testScheduleId: number
  ) {
    const testMentoringRoomList =
      await this.testMentoringRoomService.getTestMentoringRoomByTestScheduleId(
        testScheduleId
      );

    return {
      message: "OK",
      testMentoringRoomList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTestMentoringRoom(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateTestMentoringRoomDto
  ) {
    const [target, isCreated] =
      await this.testMentoringRoomService.createTestMentoringRoom(body);

    return {
      message: `received ${body}`,
      data: {
        testMentoringRoom: target,
        isCreated,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create-request")
  async createTestMentoringRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Body() body: CreateCreateTestMentoringRoomRequestDto
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);
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
    const requestList =
      await this.testMentoringRoomService.getCreateTestMentoringRoomRequestList(
        {
          testScheduleId,
        }
      );

    console.log("requestList", requestList);

    return {
      message: `${testScheduleId} requestList`,
      requestList,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/create-request")
  async deleteTestMentoringRoomRequest(
    @Req() request: AuthUserRequestDto,
    @Query("testScheduleId") testScheduleId: number
  ) {
    const userData = await this.OauthService.getProfile(request.user.userId);

    console.log("userData", userData, "testScheduleId", testScheduleId);
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
