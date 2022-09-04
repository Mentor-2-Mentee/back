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
      ["testField"]: {
        [Op.and]: {
          [Op.eq]: createCreateTestMentoringRoomRequestDto.testField,
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
          testField: createCreateTestMentoringRoomRequestDto.testField,
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
          testField: createCreateTestMentoringRoomRequestDto.testField,
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

  async deleteTestMentoringRoomRequest(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    testScheduleId: number,
    testField: string
  ) {
    const searchTestMentoringRoomRequest: WhereOptions = [];
    searchTestMentoringRoomRequest.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: testScheduleId,
        },
      },
      ["testField"]: {
        [Op.and]: {
          [Op.eq]: testField,
        },
      },
    });

    const targetRequest =
      await this.createTestMentoringRoomRequestModel.findOne({
        where: searchTestMentoringRoomRequest,
      });

    const currentUserList: any[] = [...targetRequest.requestUserList];

    console.log("*****");
    console.log("requestUserList", [...targetRequest.requestUserList]);
    if (!targetRequest) return;

    await this.createTestMentoringRoomRequestModel.update(
      {
        requestUserList: currentUserList.filter(
          (user) => user.userId !== userData.userId
        ),
      },
      {
        where: searchTestMentoringRoomRequest,
      }
    );
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
          [Op.eq]: createTestMentoringRoomDto.testField,
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
        testField: createTestMentoringRoomDto.testField,
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
        ["testField"]: {
          [Op.and]: {
            [Op.eq]: createTestMentoringRoomDto.testField,
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
