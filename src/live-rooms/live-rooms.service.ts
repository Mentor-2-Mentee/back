import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLiveRoomDto } from "./dto/create-live-room.dto";
import { UpdateLiveRoomDto } from "./dto/update-live-room.dto";
import { v4 as uuidv4 } from "uuid";
import { LiveRoom } from "./entities/live-room.entity";
import { UserM2MDto } from "src/oauth/kakao/dto/user.m2m.dto";
import { AppliedTagOptionsDto } from "./dto/applied-tag-options.dto";

@Injectable()
export class LiveRoomsService {
  constructor(
    @InjectRepository(LiveRoom)
    private liveRoomRepository: Repository<LiveRoom>
  ) {}

  async createRoom(
    userData: UserM2MDto,
    createLiveRoomDto: CreateLiveRoomDto,
    imageFiles: Express.Multer.File[]
  ): Promise<string> {
    console.log(
      "받은 값",
      userData,
      createLiveRoomDto.roomTitle,
      JSON.parse(createLiveRoomDto.appliedTagOptions),
      createLiveRoomDto.explainRoomText
    );
    const roomPath = String(uuidv4()).split("-")[0];
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public");
      const savedPath = imageFile.path.replace(rootDirName, "");
      imagesPath.push(savedPath);
    });
    console.log(imagesPath);

    const parsedAppliedTagOptions: AppliedTagOptionsDto = JSON.parse(
      createLiveRoomDto.appliedTagOptions
    );

    const findAllResult = await this.liveRoomRepository.save({
      roomId: roomPath,
      roomTitle: createLiveRoomDto.roomTitle,
      author: userData.username,
      imageFiles: JSON.stringify(imagesPath),
      parentsTag: parsedAppliedTagOptions.parentElement.filterKey,
      roomTags: JSON.stringify(parsedAppliedTagOptions.childElements),
    });
    console.log(findAllResult);

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
