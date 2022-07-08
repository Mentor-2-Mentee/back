import { Injectable } from "@nestjs/common";
import { CreateLiveRoomDto } from "./dto/create-live-room.dto";
import { UpdateLiveRoomDto } from "./dto/update-live-room.dto";
import { v4 as uuidv4 } from "uuid";
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from "@nestjs/platform-express";

@Injectable()
export class LiveRoomsService {
  async createRoom(
    createLiveRoomDto: CreateLiveRoomDto,
    imageFiles: Express.Multer.File[]
  ): Promise<string> {
    console.log(
      "받은 값",
      createLiveRoomDto.roomTitle,
      JSON.parse(createLiveRoomDto.appliedTagOptions),
      createLiveRoomDto.explainRoomText
    );
    const roomPath = String(uuidv4()).split("-")[0];

    return roomPath;
  }

  findAll() {
    return `This action returns all liveRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liveRoom`;
  }

  update(id: number, updateLiveRoomDto: UpdateLiveRoomDto) {
    return `This action updates a #${id} liveRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveRoom`;
  }
}
