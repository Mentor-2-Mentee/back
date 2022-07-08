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
  UploadedFile,
  Redirect,
} from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { CreateLiveRoomDto } from "./dto/create-live-room.dto";
import { UpdateLiveRoomDto } from "./dto/update-live-room.dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";

import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import configuration from "src/common/config/configuration";

@Controller("live-rooms")
export class LiveRoomsController {
  constructor(private readonly liveRoomsService: LiveRoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]"))
  async create(
    @Request() req,
    @Body() body: CreateLiveRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log("새 질의응답방 생성자", req.user);

    const roomPath = await this.liveRoomsService.createRoom(body, files);
    console.log("생성된 질의응답방 path", roomPath);

    return {
      url: `${configuration().clientURL}/room/${roomPath}`,
    };
  }

  @Get()
  findAll() {
    return this.liveRoomsService.findAll();
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
