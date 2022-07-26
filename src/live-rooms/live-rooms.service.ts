import { Injectable } from "@nestjs/common";
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
  Order,
} from "sequelize";
import { generateLiveRoomWhereOption } from "../common/utils/generateLiveRoomWhereOption";

@Injectable()
export class LiveRoomsService {
  constructor(
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
    const roomPath = String(uuidv4());
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = imageFile.path.replace(rootDirName, "");
      imagesPath.push(savedPath);
    });

    const parsedAppliedTagOptions: AppliedTagOptionsDto = JSON.parse(
      createLiveRoomDto.appliedTagOptions
    );
    const parsedExplainRoomText: string =
      createLiveRoomDto.explainRoomText === undefined
        ? JSON.parse(createLiveRoomDto.explainRoomText)
        : null;

    await this.liveRoomModel.create({
      roomId: roomPath,
      roomTitle: JSON.parse(createLiveRoomDto.roomTitle),
      explainRoomText: parsedExplainRoomText,
      author: userData.username,
      imageFiles: imagesPath,
      rootFilterTag:
        parsedAppliedTagOptions.rootFilterTag === undefined
          ? null
          : parsedAppliedTagOptions.rootFilterTag,
      roomTags: parsedAppliedTagOptions.childFilterTags.map((ele) => {
        return ele.tagName;
      }),
    });

    return roomPath;
  }

  async findRoomsByFilter({ page, limit, filter, option }: GetLiveRoomDto) {
    const searchFilterQuerys: WhereOptions = [];
    const orderOption: Order = [];

    switch (option) {
      case "INCREASE":
        orderOption.push(["createdAt", "ASC"]);
        break;
      case "DECREASE":
        orderOption.push(["createdAt", "DESC"]);
      default:
        orderOption.push(["createdAt", "DESC"]);
        break;
    }

    console.log(orderOption);

    if (filter.rootFilterTag) {
      searchFilterQuerys.push(
        generateLiveRoomWhereOption(
          filter.rootFilterTag,
          "rootFilterTag",
          "string"
        )
      );
    }

    if (filter.childFilterTags !== []) {
      filter.childFilterTags.map((childFilterTag) => {
        searchFilterQuerys.push(
          generateLiveRoomWhereOption(
            childFilterTag.tagName,
            "roomTags",
            "JSON"
          )
        );
      });
    }

    if (filter.filterKeywords !== []) {
      filter.filterKeywords.map((filterKeyword) => {
        searchFilterQuerys.push(
          generateLiveRoomWhereOption(filterKeyword, "roomTitle", "string")
        );
      });
    }

    const result = await this.liveRoomModel.findAll({
      where: {
        [Op.and]: searchFilterQuerys,
      },
      offset: page * limit,
      limit: limit,
      order: orderOption,
    });

    const countAllRooms = await this.liveRoomModel.count();

    return result;
  }

  async getMaxPage({ limit }: GetLiveRoomDto) {
    const countAllRooms = await this.liveRoomModel.count();

    return Math.ceil(countAllRooms / limit);
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
