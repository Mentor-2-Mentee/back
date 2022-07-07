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
} from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { CreateLiveRoomDto } from "./dto/create-live-room.dto";
import { UpdateLiveRoomDto } from "./dto/update-live-room.dto";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { v4 as uuidv4 } from "uuid";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("live-rooms")
export class LiveRoomsController {
  constructor(private readonly liveRoomsService: LiveRoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor("image[]"))
  create(
    @Request() req,
    @Body() body: CreateLiveRoomDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log("새 질의응답방 생성자", req.user);
    console.log(
      "받은 값",
      body.roomTitle,
      JSON.parse(body.appliedTagOptions),
      body.explainRoomText
    );
    // console.log("이미지 파일", files);
    const roomPath = String(uuidv4()).split("-")[0];
    console.log("생성된 질의응답방 path", roomPath);

    return {
      pathId: roomPath,
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
