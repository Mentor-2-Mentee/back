import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateCreateExamMentoringRoomRequestDto,
  CreateExamMentoringRoomDto,
  GetCreateExamMentoringRoomRequest,
  User,
} from "src/models";
import {
  CreateExamMentoringRoomRequest,
  ExamMentoringRoom,
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
import * as PDFDocument from "pdfkit";

@Injectable()
export class ExamMentoringRoomService {
  constructor(
    private readonly OauthService: OauthService,
    @InjectModel(CreateExamMentoringRoomRequest)
    private createExamMentoringRoomRequestModel: typeof CreateExamMentoringRoomRequest,
    @InjectModel(ExamMentoringRoom)
    private examMentoringRoomModel: typeof ExamMentoringRoom
  ) {}

  async createExamMentoringRoomRequest(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    createCreateExamMentoringRoomRequestDto: CreateCreateExamMentoringRoomRequestDto
  ) {
    const searchExamScheduleId: WhereOptions = [];

    searchExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createCreateExamMentoringRoomRequestDto.examScheduleId,
        },
      },
      ["examField"]: {
        [Op.and]: {
          [Op.eq]: createCreateExamMentoringRoomRequestDto.examField,
        },
      },
    });

    const [target, created] =
      await this.createExamMentoringRoomRequestModel.findOrCreate({
        where: {
          [Op.and]: searchExamScheduleId,
        },
        defaults: {
          examScheduleId:
            createCreateExamMentoringRoomRequestDto.examScheduleId,
          examField: createCreateExamMentoringRoomRequestDto.examField,
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
      await this.createExamMentoringRoomRequestModel.update(
        {
          examScheduleId:
            createCreateExamMentoringRoomRequestDto.examScheduleId,
          examField: createCreateExamMentoringRoomRequestDto.examField,
          requestUserList: [...target.requestUserList, userData],
        },
        {
          where: {
            [Op.and]: searchExamScheduleId,
          },
        }
      );
    }
  }

  async getCreateExamMentoringRoomRequestList({
    examScheduleId,
  }: GetCreateExamMentoringRoomRequest) {
    const searchExamScheduleId: WhereOptions = [];

    searchExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
    });

    const requestList = await this.createExamMentoringRoomRequestModel.findAll({
      where: {
        [Op.and]: searchExamScheduleId,
      },
    });

    return requestList;
  }

  async deleteExamMentoringRoomRequest(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    examScheduleId: number,
    examField: string
  ) {
    const searchExamMentoringRoomRequest: WhereOptions = [];
    searchExamMentoringRoomRequest.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
      ["examField"]: {
        [Op.and]: {
          [Op.eq]: examField,
        },
      },
    });

    const targetRequest =
      await this.createExamMentoringRoomRequestModel.findOne({
        where: searchExamMentoringRoomRequest,
      });

    const currentUserList: any[] = [...targetRequest.requestUserList];

    console.log("*****");
    console.log("requestUserList", [...targetRequest.requestUserList]);
    if (!targetRequest) return;

    await this.createExamMentoringRoomRequestModel.update(
      {
        requestUserList: currentUserList.filter(
          (user) => user.userId !== userData.userId
        ),
      },
      {
        where: searchExamMentoringRoomRequest,
      }
    );
  }

  async createExamMentoringRoom(
    createExamMentoringRoomDto: CreateExamMentoringRoomDto
  ) {
    const searchByExamScheduleIdAndExamField: WhereOptions = [];
    searchByExamScheduleIdAndExamField.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createExamMentoringRoomDto.examScheduleId,
        },
      },
      ["examField"]: {
        [Op.and]: {
          [Op.eq]: createExamMentoringRoomDto.examField,
        },
      },
    });

    const newExamMentoringRoomId = uuidv4();

    const [target, isCreated] = await this.examMentoringRoomModel.findOrCreate({
      where: {
        [Op.and]: searchByExamScheduleIdAndExamField,
      },
      defaults: {
        examMentoringRoomId: newExamMentoringRoomId,
        examScheduleId: createExamMentoringRoomDto.examScheduleId,
        examField: createExamMentoringRoomDto.examField,
        userList: [
          ...createExamMentoringRoomDto.userList.map((user) => user.userId),
        ],
        chatListBundle: [],
        examQuestionList: [],
      },
    });

    if (isCreated) {
      const searchDestoryRequest: WhereOptions = [];
      searchDestoryRequest.push({
        ["examScheduleId"]: {
          [Op.and]: {
            [Op.eq]: createExamMentoringRoomDto.examScheduleId,
          },
        },
        ["examField"]: {
          [Op.and]: {
            [Op.eq]: createExamMentoringRoomDto.examField,
          },
        },
      });
      await this.createExamMentoringRoomRequestModel.destroy({
        where: {
          [Op.and]: searchDestoryRequest,
        },
      });
    }

    return [target, isCreated];
  }

  async getExamMentoringRoomByExamScheduleId(examScheduleId: number) {
    const searchByExamScheduleId: WhereOptions = [];
    searchByExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
    });

    const examMentoringRoomList = await this.examMentoringRoomModel.findAll({
      where: {
        [Op.and]: searchByExamScheduleId,
      },
    });

    return examMentoringRoomList;
  }

  async generatePDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "LETTER",
        bufferPages: true,
      });

      // customize your PDF document
      doc.text("hello world", 100, 50);
      doc.end();

      const buffer = [];
      doc.on("data", buffer.push.bind(buffer));
      doc.on("end", () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }
}