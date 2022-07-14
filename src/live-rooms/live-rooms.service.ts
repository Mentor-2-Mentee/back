import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  AppliedTagOptionsDto,
  CreateLiveRoomDto,
  GetLiveRoomDto,
  UpdateLiveRoomDto,
} from "src/models/dto";
import { v4 as uuidv4 } from "uuid";
import { LiveRoom } from "src/models/entities";
import { InjectModel } from "@nestjs/sequelize";
import {
  Sequelize,
  IncludeOptions,
  OrderItem,
  WhereOptions,
  Op,
} from "sequelize";

export enum ItemTypes {
  /**
   * 제품
   */
  product = "product",
  /**
   * 부속품
   */
  parts = "parts",
}

export type ItemType = typeof ItemTypes[keyof typeof ItemTypes];

@Injectable()
export class LiveRoomsService {
  constructor(
    // @InjectRepository(LiveRoom)
    // private liveRoomRepository: Repository<LiveRoom>
    @InjectModel(LiveRoom)
    private liveRoomModel: typeof LiveRoom
  ) {}

  async createRoom(
    userData: {
      userId: number;
      username: string;
    },
    createLiveRoomDto: CreateLiveRoomDto,
    imageFiles: Express.Multer.File[]
  ): Promise<string> {
    console.log(
      userData,
      createLiveRoomDto.roomTitle,
      JSON.parse(createLiveRoomDto.appliedTagOptions),
      createLiveRoomDto.explainRoomText
    );
    const roomPath = String(uuidv4()).split("-")[0];
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = imageFile.path.replace(rootDirName, "");
      imagesPath.push(savedPath);
    });

    const parsedAppliedTagOptions: AppliedTagOptionsDto = JSON.parse(
      createLiveRoomDto.appliedTagOptions
    );

    const findAllResult = await this.liveRoomModel.create({
      roomId: roomPath,
      roomTitle: createLiveRoomDto.roomTitle,
      explainRoomText: createLiveRoomDto.explainRoomText,
      author: userData.username,
      imageFiles: JSON.stringify(imagesPath),
      parentsTag:
        parsedAppliedTagOptions.rootFilterTag === undefined
          ? null
          : parsedAppliedTagOptions.rootFilterTag,
      roomTags: JSON.stringify(
        parsedAppliedTagOptions.childFilterTags.map((ele) => {
          return ele.tagName;
        })
      ),
    });

    return roomPath;
  }

  async findRoomsByFilter({ page, limit, filter }: GetLiveRoomDto) {
    console.log(page, limit, filter);

    let where: WhereOptions;

    const asd = filter.childFilterTags.map((childTag) => {
      return childTag.tagName;
    });
    console.log(asd);

    if (filter) {
      where = {
        [Op.and]: [
          {
            parentsTag: {
              [Op.like]: "NCS",
            },
          },
          {
            roomTags: {
              [Op.like]: "수리능력",
            },
          },
        ],
      };
    }

    const result = await this.liveRoomModel.findAll({
      where,
      // offset: page * limit,
      // limit: limit,
    });

    return result;
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
