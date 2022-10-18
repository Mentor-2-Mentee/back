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
    requestUserId: string,
    { examScheduleId, examType }: CreateCreateExamReviewRoomRequestDto
  ): Promise<[boolean, string]> {
    if (examType === "") return [false, "응시 직군이 입력되지 않았습니다."];
    const searchExamScheduleId: WhereOptions = [];
    searchExamScheduleId.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
      ["examType"]: {
        [Op.and]: {
          [Op.eq]: examType,
        },
      },
    });

    const existRoom = await this.examReviewRoomModel.findOne({
      include: [{ model: ExamSchedule, where: { id: examScheduleId } }],
    });

    if (existRoom) {
      return [false, `${examType}은 이미 생성되었습니다.`];
    }

    const [existRequest, created] =
      await this.createExamReviewRoomRequestModel.findOrCreate({
        where: {
          [Op.and]: searchExamScheduleId,
        },
        defaults: {
          examScheduleId,
          examType,
          participantUserId: requestUserId,
        },
      });

    if (!created) {
      return [false, `${examType}은 이미 생성되었습니다.`];
    }
    return [true, `${examType} 신청 완료`];
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
    examType: string
  ) {
    const searchExamReviewRoomRequest: WhereOptions = [];
    searchExamReviewRoomRequest.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
      ["examType"]: {
        [Op.and]: {
          [Op.eq]: examType,
        },
      },
    });

    const targetRequest = await this.createExamReviewRoomRequestModel.findOne({
      where: searchExamReviewRoomRequest,
    });

    const currentUserList: any[] = [...targetRequest.nonParticipantUserId];
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
      ["examType"]: {
        [Op.and]: {
          [Op.eq]: createExamReviewRoomDto.examType,
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
        examType: createExamReviewRoomDto.examType,
        chatListBundle: [],
        examQuestionList: await this.ExamQuestionService.createBulkQuestion({
          examScheduleId: createExamReviewRoomDto.examScheduleId,
          examType: createExamReviewRoomDto.examType,
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
        ["examType"]: {
          [Op.and]: {
            [Op.eq]: createExamReviewRoomDto.examType,
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
    const examSchedule = await (
      await this.examScheduleModel.findByPk(examScheduleId)
    ).$get("examReviewRooms");

    return examSchedule;
  }

  async findExamReviewRoomOne(examScheduleId: number, examType: string) {
    const searchExamReviewRoom: WhereOptions = [];
    searchExamReviewRoom.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
      ["examType"]: {
        [Op.and]: {
          [Op.eq]: examType,
        },
      },
    });

    return await this.examReviewRoomModel.findOne({
      where: searchExamReviewRoom,
    });
  }

  async updateExamReviewRoomOne(
    examScheduleId: number,
    examType: string,
    updateData?: any
  ) {
    const searchExamReviewRoom: WhereOptions = [];
    searchExamReviewRoom.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
      ["examType"]: {
        [Op.and]: {
          [Op.eq]: examType,
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
          `${examReviewRoom.examSchedule.organizer} - ${examReviewRoom.examType} / ${examDate}`,
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
          `${examReviewRoom.examSchedule.organizer} - ${examReviewRoom.examType} - 솔루션 / ${examDate}`,
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
    //     examType: targetRoom.examType,
    //   };
    // }

    return {
      message: "not enteredUser",
    };
  }
}
