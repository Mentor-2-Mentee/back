import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateCreateExamReviewRoomRequestDto,
  CreateExamReviewRoomDto,
  GetCreateExamReviewRoomRequest,
  User,
} from "src/models";
import {
  CreateExamReviewRoomRequest,
  ExamReviewRoom,
  ExamSchedule,
  ExamScheduleRelation,
} from "src/models/entities";
import { WhereOptions, Op } from "sequelize";
import { ExamQuestionService } from "src/exam-question/exam-question.service";
import { v4 as uuidv4 } from "uuid";
import * as PDFDocument from "pdfkit";
import DateFormatting from "src/common/utils/DateFormatting";
import configuration from "src/common/config/configuration";

const INITIAL_QUESTION_COUNT = 5;

@Injectable()
export class ExamReviewRoomService {
  constructor(
    private readonly ExamQuestionService: ExamQuestionService,
    @InjectModel(CreateExamReviewRoomRequest)
    private createExamReviewRoomRequestModel: typeof CreateExamReviewRoomRequest,
    @InjectModel(ExamReviewRoom)
    private examReviewRoomModel: typeof ExamReviewRoom,
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule
  ) {}

  async createExamReviewRoomRequest(
    userData: Pick<User, "id" | "userName" | "userGrade">,
    createCreateExamReviewRoomRequestDto: CreateCreateExamReviewRoomRequestDto
  ) {
    const searchExamScheduleId: WhereOptions = [];

    searchExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createCreateExamReviewRoomRequestDto.examScheduleId,
        },
      },
      ["examField"]: {
        [Op.and]: {
          [Op.eq]: createCreateExamReviewRoomRequestDto.examField,
        },
      },
    });

    const [target, created] =
      await this.createExamReviewRoomRequestModel.findOrCreate({
        where: {
          [Op.and]: searchExamScheduleId,
        },
        defaults: {
          examScheduleId: createCreateExamReviewRoomRequestDto.examScheduleId,
          examField: createCreateExamReviewRoomRequestDto.examField,
          // requestUserList: [userData],
        },
      });

    if (!created) {
      const existUserList: any[] = [...target.requestUserList];
      const isExist = Boolean();
      // existUserList.findIndex((user) => user.userId === userData.userId) !==
      // -1
      if (isExist) return;
      await this.createExamReviewRoomRequestModel.update(
        {
          examScheduleId: createCreateExamReviewRoomRequestDto.examScheduleId,
          examField: createCreateExamReviewRoomRequestDto.examField,
          // requestUserList: [...target.requestUserList, userData],
        },
        {
          where: {
            [Op.and]: searchExamScheduleId,
          },
        }
      );
    }
  }

  async getCreateExamReviewRoomRequestList({
    examScheduleId,
  }: GetCreateExamReviewRoomRequest) {
    const searchExamScheduleId: WhereOptions = [];

    searchExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
    });

    const requestList = await this.createExamReviewRoomRequestModel.findAll({
      where: {
        [Op.and]: searchExamScheduleId,
      },
    });

    return requestList;
  }

  async deleteExamReviewRoomRequest(
    userData: Pick<User, "id" | "userName" | "userGrade">,
    examScheduleId: number,
    examField: string
  ) {
    const searchExamReviewRoomRequest: WhereOptions = [];
    searchExamReviewRoomRequest.push({
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

    const targetRequest = await this.createExamReviewRoomRequestModel.findOne({
      where: searchExamReviewRoomRequest,
    });

    const currentUserList: any[] = [...targetRequest.requestUserList];

    console.log("*****");
    console.log("requestUserList", [...targetRequest.requestUserList]);
    if (!targetRequest) return;

    await this.createExamReviewRoomRequestModel.update(
      {
        // requestUserList: currentUserList.filter(
        //   (user) => user.userId !== userData.userId
        // ),
      },
      {
        where: searchExamReviewRoomRequest,
      }
    );
  }

  async createExamReviewRoom(createExamReviewRoomDto: CreateExamReviewRoomDto) {
    const searchByExamScheduleIdAndExamField: WhereOptions = [];
    searchByExamScheduleIdAndExamField.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: createExamReviewRoomDto.examScheduleId,
        },
      },
      ["examField"]: {
        [Op.and]: {
          [Op.eq]: createExamReviewRoomDto.examField,
        },
      },
    });

    const [target, isCreated] = await this.examReviewRoomModel.findOrCreate({
      where: {
        [Op.and]: searchByExamScheduleIdAndExamField,
      },
      defaults: {
        examScheduleTitle: createExamReviewRoomDto.examScheduleTitle,
        examScheduleId: createExamReviewRoomDto.examScheduleId,
        examField: createExamReviewRoomDto.examField,
        // userList: [
        //   ...createExamReviewRoomDto.userList.map((user) => user.userId),
        // ],
        chatListBundle: [],
        examQuestionList: await this.ExamQuestionService.createBulkQuestion({
          examScheduleId: createExamReviewRoomDto.examScheduleId,
          examField: createExamReviewRoomDto.examField,
          bulkCount: 5,
        }),
      },
    });

    if (isCreated) {
      const searchDestoryRequest: WhereOptions = [];
      searchDestoryRequest.push({
        ["examScheduleId"]: {
          [Op.and]: {
            [Op.eq]: createExamReviewRoomDto.examScheduleId,
          },
        },
        ["examField"]: {
          [Op.and]: {
            [Op.eq]: createExamReviewRoomDto.examField,
          },
        },
      });
      await this.createExamReviewRoomRequestModel.destroy({
        where: {
          [Op.and]: searchDestoryRequest,
        },
      });
    }

    return [target, isCreated];
  }

  async findExamReviewRoomList(examScheduleId: number) {
    const searchByExamScheduleId: WhereOptions = [];
    searchByExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
    });
    console.log("-----", examScheduleId, "------");

    const examSchedule = await this.examScheduleModel
      .findByPk(examScheduleId, {
        include: [{ model: ExamReviewRoom }, { model: ExamScheduleRelation }],
      })
      .then((data) => {
        const parsedRooms = data.examReviewRooms.map((examReviewRoom) => {
          return {
            ...examReviewRoom,
            adminUserId: JSON.parse(String(examReviewRoom.adminUserId)),
            participantUserId: JSON.parse(
              String(examReviewRoom.participantUserId)
            ),
            nonParticipantUserId: JSON.parse(
              String(examReviewRoom.nonParticipantUserId)
            ),
          };
        });
        console.log("parse test data", parsedRooms);
        return data;
      });

    console.log("joined examSchedule", examSchedule.examReviewRooms);

    // const examReviewRoomList = await this.examReviewRoomModel.findAll({
    //   where: {
    //     [Op.and]: searchByExamScheduleId,
    //   },
    // });

    return examSchedule.examReviewRooms;
  }

  async findExamReviewRoomOne(examScheduleId: number, examField: string) {
    const searchExamReviewRoom: WhereOptions = [];
    searchExamReviewRoom.push({
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

    const test = await this.examReviewRoomModel.findOne({
      where: searchExamReviewRoom,
    });

    return await this.examReviewRoomModel.findOne({
      where: searchExamReviewRoom,
    });
  }

  async updateExamReviewRoomOne(
    examScheduleId: number,
    examField: string,
    updateData?: any
  ) {
    const searchExamReviewRoom: WhereOptions = [];
    searchExamReviewRoom.push({
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

    await this.examReviewRoomModel.update(
      {
        ...updateData,
      },
      {
        where: searchExamReviewRoom,
      }
    );

    return await this.examReviewRoomModel.findOne({
      where: searchExamReviewRoom,
    });
  }

  async generateQuestionPDF(
    examReviewRoom: ExamReviewRoom,
    examQuestionIdList: number[]
  ): Promise<Buffer> {
    const examQuestionList = await this.ExamQuestionService.findQuestionAll(
      examQuestionIdList
    );

    const examDate = new DateFormatting(new Date(examReviewRoom.createdAt))
      .YYYY_MM_DD;

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
      });
      //나눔고딕폰트
      doc.font("src/asset/font/NanumGothic.ttf");

      //시험지 제목
      doc
        .fontSize(18)
        .text(
          `${examReviewRoom.examOrganizer} - ${examReviewRoom.examType} / ${examDate}`,
          50,
          50
        )
        .moveDown();

      //문제본문
      doc.fontSize(12);
      examQuestionList.map((question, questionIndex) => {
        doc
          .text(`${questionIndex + 1}) ${question.questionText}`)
          .moveDown(0.5);

        if (question.questionImageUrl[0]) {
          const outerUrl = new RegExp(configuration().apiServerBaseURL);
          const filePath = question.questionImageUrl[0].replace(
            outerUrl,
            "public/"
          );
          doc
            .image(filePath, {
              height: 150,
              align: "center",
              valign: "center",
            })
            .moveDown(0.5);
        }

        question.answerExample.map((example, exampleIndex) => {
          doc.text(`${exampleIndex + 1}. ${example}`).moveDown(0.5);
        });
        doc.moveDown();
      });

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

  async generateSolutionPDF(
    examReviewRoom: ExamReviewRoom,
    examQuestionIdList: number[]
  ): Promise<Buffer> {
    const examQuestionList = await this.ExamQuestionService.findQuestionAll(
      examQuestionIdList
    );

    const examDate = new DateFormatting(new Date(examReviewRoom.createdAt))
      .YYYY_MM_DD;

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "A4",
        bufferPages: true,
      });
      //나눔고딕폰트
      doc.font("src/asset/font/NanumGothic.ttf");

      //시험지 제목
      doc
        .fontSize(18)
        .text(
          `${examReviewRoom.examOrganizer} - ${examReviewRoom.examType} - 솔루션 / ${examDate}`,
          50,
          50
        )
        .moveDown();

      //문제해설
      doc.fontSize(12);
      examQuestionList.map((question, questionIndex) => {
        doc
          .text(`${questionIndex + 1}) ${question.questionText}`)
          .moveDown(0.5);

        doc.text(`풀이 : ${question.solution}`).moveDown(0.5);
        doc.text(`답 : ${question.answer}`).moveDown(0.5);
        doc.moveDown();
      });

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

  async checkUserEntered(userId: string, examReviewRoomId: number) {
    const targetRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );

    // const isEndtered = Boolean(
    //   targetRoom.userList.findIndex((ele) => ele === userId) !== -1
    // );

    // if (isEndtered) {
    //   return {
    //     message: "enteredUser",
    //     examScheduleId: targetRoom.examScheduleId,
    //     examField: targetRoom.examField,
    //   };
    // }

    return {
      message: "not enteredUser",
    };
  }
}
