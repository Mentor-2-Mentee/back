import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateCreateTestMentoringRoomRequestDto,
  GetCreateTestMentoringRoomRequest,
  User,
} from "src/models";
import { CreateTestMentoringRoomRequest } from "src/models/entities";
import {
  Sequelize,
  IncludeOptions,
  OrderItem,
  WhereOptions,
  Op,
  Order,
} from "sequelize";

@Injectable()
export class TestMentoringRoomService {
  constructor(
    @InjectModel(CreateTestMentoringRoomRequest)
    private createTestMentoringRoomRequestModel: typeof CreateTestMentoringRoomRequest
  ) {}

  async createTestMentoringRoomRequest(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    createCreateTestMentoringRoomRequestDto: CreateCreateTestMentoringRoomRequestDto
  ) {
    const searchTestScheduleId: WhereOptions = [];

    searchTestScheduleId.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createCreateTestMentoringRoomRequestDto.testScheduleId,
        },
      },
      ["requestWorkField"]: {
        [Op.and]: {
          [Op.eq]: createCreateTestMentoringRoomRequestDto.requestWorkField,
        },
      },
    });

    const [target, created] =
      await this.createTestMentoringRoomRequestModel.findOrCreate({
        where: {
          [Op.and]: searchTestScheduleId,
        },
        defaults: {
          testScheduleId:
            createCreateTestMentoringRoomRequestDto.testScheduleId,
          requestWorkField:
            createCreateTestMentoringRoomRequestDto.requestWorkField,
          requestUserList: [userData],
        },
      });

    if (!created) {
      const existUserList: any[] = [...target.requestUserList];
      const isExist = Boolean(
        existUserList.findIndex((user) => user.userId === userData.userId) !==
          -1
      );
      if (isExist) return;
      await this.createTestMentoringRoomRequestModel.update(
        {
          testScheduleId:
            createCreateTestMentoringRoomRequestDto.testScheduleId,
          requestWorkField:
            createCreateTestMentoringRoomRequestDto.requestWorkField,
          requestUserList: [...target.requestUserList, userData],
        },
        {
          where: {
            [Op.and]: searchTestScheduleId,
          },
        }
      );
    }
  }

  async getCreateTestMentoringRoomRequestList({
    testScheduleId,
  }: GetCreateTestMentoringRoomRequest) {
    const searchTestScheduleId: WhereOptions = [];

    searchTestScheduleId.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: testScheduleId,
        },
      },
    });

    const requestList = await this.createTestMentoringRoomRequestModel.findAll({
      where: {
        [Op.and]: searchTestScheduleId,
      },
    });

    return requestList;
  }
}
