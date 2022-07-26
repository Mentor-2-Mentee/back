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
  UseInterceptors,
  UploadedFiles,
  Query,
} from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { CreateLiveRoomDto, UpdateLiveRoomDto } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";

import { FilesInterceptor } from "@nestjs/platform-express";
import configuration from "../common/config/configuration";
import { GetLiveRoomDto, UserM2MDto } from "src/models/dto";
import { OauthService } from "src/oauth/oauth.service";

const MAX_IMAGE_COUNT = 10;

@Controller("live-rooms")
export class LiveRoomsController {
  constructor(
    private readonly liveRoomsService: LiveRoomsService,
    private readonly OauthService: OauthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async create(
    @Request() req,
    @Body() body: CreateLiveRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log("새 질의응답방 생성자", req.user);

    const userData = await this.OauthService.getProfile(req.user);
    const roomPath = await this.liveRoomsService.createRoom(
      userData,
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
    console.log("/GET live-rooms", page, limit, filter);
    const querys: GetLiveRoomDto = {
      page: Number(page),
      limit: Number(limit),
      filter: JSON.parse(filter),
    };

    const roomList = await this.liveRoomsService.findRoomsByFilter(querys);
    const maxpage = await this.liveRoomsService.getMaxPage(querys);

    if (Number(page) >= maxpage) {
      return {
        data: roomList,
      };
    }

    return {
      data: roomList,
      nextPage: Number(page) + 1,
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.liveRoomsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLiveRoomDto: UpdateLiveRoomDto
  ) {
    return this.liveRoomsService.update(+id, updateLiveRoomDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.liveRoomsService.remove(+id);
  }
}
