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
import configuration from "src/common/config/configuration";
import { UserM2MDto } from "src/models/dto";
import { OauthService } from "src/oauth/oauth.service";
import { query } from "express";

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
  async getLiveRoomList(@Query() query) {
    console.log("GET /live-rooms", query);

    return "ok";
  }

  // @Get()
  // findAll() {
  //   return this.liveRoomsService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.liveRoomsService.findOne(+id);
  // }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateLiveRoomDto: UpdateLiveRoomDto
  // ) {
  //   return this.liveRoomsService.update(+id, updateLiveRoomDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.liveRoomsService.remove(+id);
  // }
}
