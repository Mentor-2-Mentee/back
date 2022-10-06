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
import configuration from "src/common/config/configuration";

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
  ): Promise<number> {
    console.log(
      userData,
      createLiveRoomDto.mentoringRoomTitle,
      JSON.parse(createLiveRoomDto.appliedTagOptions),
      createLiveRoomDto.mentoringRoomDescription
    );
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = `${
        configuration().apiServerBaseURL
      }/${imageFile.path.replace(rootDirName, "")}`;
      imagesPath.push(savedPath);
    });

    const parsedAppliedTagOptions: AppliedTagOptionsDto = JSON.parse(
      createLiveRoomDto.appliedTagOptions
    );
    const parsedExplainRoomText: string = JSON.parse(
      createLiveRoomDto.mentoringRoomDescription
    );

    const createdRoom = await this.liveRoomModel.create({
      mentoringRoomTitle: JSON.parse(createLiveRoomDto.mentoringRoomTitle),
      mentoringRoomDescription: parsedExplainRoomText,
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

    return createdRoom.id;
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
          generateLiveRoomWhereOption(
            filterKeyword,
            "mentoringRoomTitle",
            "string"
          )
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
