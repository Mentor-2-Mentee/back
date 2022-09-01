import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateCreateTestMentoringRoomRequestDto,
  CreateTestMentoringRoomDto,
  GetCreateTestMentoringRoomRequest,
  User,
} from "src/models";
import {
  CreateTestMentoringRoomRequest,
  TestMentoringRoom,
} from "src/models/entities";
import {
  Sequelize,
  IncludeOptions,
  OrderItem,
  WhereOptions,
  Op,
  Order,
} from "sequelize";
import { OauthService } from "src/oauth/oauth.service";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TestMentoringRoomService {
  constructor(
    private readonly OauthService: OauthService,
    @InjectModel(CreateTestMentoringRoomRequest)
    private createTestMentoringRoomRequestModel: typeof CreateTestMentoringRoomRequest,
    @InjectModel(TestMentoringRoom)
    private testMentoringRoomModel: typeof TestMentoringRoom
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
      ["requestTestField"]: {
        [Op.and]: {
          [Op.eq]: createCreateTestMentoringRoomRequestDto.requestTestField,
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
          requestTestField:
            createCreateTestMentoringRoomRequestDto.requestTestField,
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
          requestTestField:
            createCreateTestMentoringRoomRequestDto.requestTestField,
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

  async createTestMentoringRoom(
    createTestMentoringRoomDto: CreateTestMentoringRoomDto
  ) {
    const searchByTestScheduleIdAndTestField: WhereOptions = [];
    searchByTestScheduleIdAndTestField.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createTestMentoringRoomDto.testScheduleId,
        },
      },
      ["testField"]: {
        [Op.and]: {
          [Op.eq]: createTestMentoringRoomDto.requestTestField,
        },
      },
    });

    const newTestMentoringRoomId = uuidv4();

    const [target, isCreated] = await this.testMentoringRoomModel.findOrCreate({
      where: {
        [Op.and]: searchByTestScheduleIdAndTestField,
      },
      defaults: {
        testMentoringRoomId: newTestMentoringRoomId,
        testScheduleId: createTestMentoringRoomDto.testScheduleId,
        testField: createTestMentoringRoomDto.requestTestField,
        userList: [
          ...createTestMentoringRoomDto.userList.map((user) => user.userId),
        ],
        chatListBundle: [],
        testQuestionList: [],
      },
    });

    if (isCreated) {
      const searchDestoryRequest: WhereOptions = [];
      searchDestoryRequest.push({
        ["testScheduleId"]: {
          [Op.and]: {
            [Op.eq]: createTestMentoringRoomDto.testScheduleId,
          },
        },
        ["requestTestField"]: {
          [Op.and]: {
            [Op.eq]: createTestMentoringRoomDto.requestTestField,
          },
        },
      });
      await this.createTestMentoringRoomRequestModel.destroy({
        where: {
          [Op.and]: searchDestoryRequest,
        },
      });
    }

    return [target, isCreated];
  }

  async getTestMentoringRoomByTestScheduleId(testScheduleId: number) {
    const searchByTestScheduleId: WhereOptions = [];
    searchByTestScheduleId.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: testScheduleId,
        },
      },
    });

    const testMentoringRoomList = await this.testMentoringRoomModel.findAll({
      where: {
        [Op.and]: searchByTestScheduleId,
      },
    });

    return testMentoringRoomList;
  }
}
