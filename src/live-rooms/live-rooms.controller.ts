import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  Req,
} from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { CreateLiveRoomDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";

import { FilesInterceptor } from "@nestjs/platform-express";
import configuration from "../common/config/configuration";
import { AuthorizeUserProfile, GetLiveRoomDto } from "src/models/dto";
import { UserProfileService } from "src/user-profile/user-profile.service";

const MAX_IMAGE_COUNT = 10;

@Controller("live-rooms")
export class LiveRoomsController {
  constructor(
    private readonly liveRoomsService: LiveRoomsService,
    private readonly userProfileService: UserProfileService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async create(
    @Req() request: AuthorizeUserProfile,
    @Body() body: CreateLiveRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const userData = await this.userProfileService.findUserProfileById(
      request.user.id
    );
    const roomPath = await this.liveRoomsService.createRoom(
      {
        id: userData.id,
        userName: userData.userName,
      },
      body,
      files
    );

    return {
      url: `${configuration().clientURL}/room/${roomPath}`,
    };
  }

  @Get()
  async findRooms(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("filter") filter: string
  ) {
    const querys: GetLiveRoomDto = {
      page: Number(page),
      limit: Number(limit),
      filter: JSON.parse(filter),
    };

    const roomList = await this.liveRoomsService.findRoomsByFilter(querys);
    const maxpage = await this.liveRoomsService.getMaxPage(querys);

    if (Number(page) >= maxpage) {
      return {
        mentoringRoomList: roomList,
      };
    }

    return {
      mentoringRoomList: roomList,
      nextPage: Number(page) + 1,
    };
  }
}
