import { Injectable } from "@nestjs/common";
import { CreateLiveRoomDto, GetLiveRoomDto } from "src/models/dto";
import { LiveRoom } from "src/models/entities";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions, Op, Order } from "sequelize";
import { generateLiveRoomWhereOption } from "../common/utils/generateLiveRoomWhereOption";
import configuration from "src/common/config/configuration";
import { AppliedTagOptions } from "src/models";

@Injectable()
export class LiveRoomsService {
  constructor(
    @InjectModel(LiveRoom)
    private liveRoomModel: typeof LiveRoom
  ) {}

  async createRoom(
    userData: {
      id: string;
      userName: string;
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

    const parsedAppliedTagOptions: AppliedTagOptions = JSON.parse(
      createLiveRoomDto.appliedTagOptions
    );
    const parsedExplainRoomText: string = JSON.parse(
      createLiveRoomDto.mentoringRoomDescription
    );

    const createdRoom = await this.liveRoomModel.create({
      mentoringRoomTitle: JSON.parse(createLiveRoomDto.mentoringRoomTitle),
      mentoringRoomDescription: parsedExplainRoomText,
      author: userData.userName,
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
}
