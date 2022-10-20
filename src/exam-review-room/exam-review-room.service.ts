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
import { whereAndOptions } from "src/common/utils";

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
    private examScheduleModel: typeof ExamSchedule,
    @InjectModel(ExamScheduleRelation)
    private examScheduleRelation: typeof ExamScheduleRelation
  ) {}

  async createExamReviewRoomRequest(
    requestUserId: string,
    {
      examScheduleId,
      examType,
      isParticipant,
    }: CreateCreateExamReviewRoomRequestDto
  ): Promise<[boolean, string]> {
    if (examType === "") return [false, "응시 직군이 입력되지 않았습니다."];

    const searchRequestOptions = whereAndOptions({
      examScheduleId,
      examType,
    });

    const existRoom = await this.examReviewRoomModel.findOne({
      include: [{ model: ExamSchedule, where: { id: examScheduleId } }],
      where: { examType },
    });

    if (existRoom) {
      return [false, `${examType} 리뷰방은 이미 생성되었습니다.`];
    }

    const [existRequest, created] =
      await this.createExamReviewRoomRequestModel.findOrCreate({
        where: {
          [Op.and]: searchRequestOptions,
        },
        defaults: {
          examScheduleId,
          examType,
          participantUserId: isParticipant ? [requestUserId] : [],
          nonParticipantUserId: isParticipant ? [] : [requestUserId],
        },
      });

    await this.examScheduleRelation.create({
      examScheduleId,
      createExamReviewRoomRequestId: existRequest.id,
    });

    if (!created) {
      const [isExist, message] = await this.enterCreateExamReviewRoom(
        requestUserId,
        existRequest.id,
        isParticipant
      );
      return [isExist, `${examType} ${message}`];
    }
    return [created, `${examType} 신청 완료`];
  }

  async enterCreateExamReviewRoom(
    requestUserId: string,
    requestId: number,
    isParticipant: boolean
  ): Promise<[boolean, string]> {
    const targetRequest = await this.createExamReviewRoomRequestModel.findByPk(
      requestId
    );

    const isExist =
      targetRequest.participantUserId.findIndex(
        (currentUser) => currentUser === requestUserId
      ) !== -1 ||
      targetRequest.nonParticipantUserId.findIndex(
        (currentUser) => currentUser === requestUserId
      ) !== -1;

    if (isExist) return [true, "이미 신청되어있습니다"];

    await this.createExamReviewRoomRequestModel.update(
      {
        participantUserId: isParticipant
          ? [...targetRequest.participantUserId, requestUserId]
          : targetRequest.participantUserId,
        nonParticipantUserId: isParticipant
          ? targetRequest.nonParticipantUserId
          : [...targetRequest.nonParticipantUserId, requestUserId],
      },
      {
        where: { id: targetRequest.id },
      }
    );

    return [false, "신청 완료"];
  }

  async getRequestList(examScheduleId: number, userId?: string) {
    const requestList = await this.createExamReviewRoomRequestModel.findAll({
      where: {
        examScheduleId,
      },
    });

    const reformedRequestList = requestList.map(
      ({
        id,
        examScheduleId,
        examType,
        participantUserId,
        nonParticipantUserId,
      }) => {
        const userExistCheck = (userId: string) => {
          if (
            participantUserId.findIndex(
              (participantUser) => participantUser === userId
            ) !== -1
          )
            return "participantUser";
          if (
            nonParticipantUserId.findIndex(
              (nonParticipantUser) => nonParticipantUser === userId
            ) !== -1
          )
            return "nonParticipantUser";
          return false;
        };

        return {
          id,
          examScheduleId,
          examType,
          totalUserCount:
            participantUserId.length + nonParticipantUserId.length,
          userExist: userExistCheck(userId),
        };
      }
    );

    return reformedRequestList;
  }

  async cancelRequest(userId: string, requestId: number) {
    const targetRequest = await this.createExamReviewRoomRequestModel.findByPk(
      requestId
    );

    let isExist: boolean;
    const newParticipantUser: string[] = targetRequest.participantUserId.filter(
      (currentUser) => {
        if (currentUser === userId) {
          isExist = true;
          return false;
        }
        return true;
      }
    );

    const newNonParticipantUser: string[] =
      targetRequest.nonParticipantUserId.filter((currentUser) => {
        if (currentUser === userId) {
          isExist = true;
          return false;
        }
        return true;
      });

    if (!isExist) return false;

    await this.createExamReviewRoomRequestModel.update(
      {
        participantUserId: newParticipantUser,
        nonParticipantUserId: newNonParticipantUser,
      },
      {
        where: { id: requestId },
      }
    );
    return true;
  }

  async deleteRequest(requestId: number) {
    const targetRequest = await this.createExamReviewRoomRequestModel.findByPk(
      requestId,
      { include: { model: ExamScheduleRelation } }
    );
    const destroyedCount = await this.createExamReviewRoomRequestModel.destroy({
      where: { id: requestId },
    });
    await this.deleteRelation(targetRequest.ExamScheduleRelation.id);
    return Boolean(destroyedCount !== 0);
  }

  async deleteRelation(relationId: string) {
    const destroyedCount = await this.examScheduleRelation.destroy({
      where: { id: relationId },
    });
    return Boolean(destroyedCount !== 0);
  }

  async createExamReviewRoom(adminUserId: string, requestId: number) {
    const targetRequest = await this.createExamReviewRoomRequestModel.findByPk(
      requestId,
      { include: { model: ExamScheduleRelation } }
    );

    const createdRoom = await this.examReviewRoomModel.create({
      examType: targetRequest.examType,
      examScheduleId: targetRequest.examScheduleId,
      examQuestionId: await this.ExamQuestionService.createBulkQuestion({
        examScheduleId: targetRequest.examScheduleId,
        examType: targetRequest.examType,
        bulkCount: 5,
      }),
      adminUserId: [adminUserId],
      participantUserId: targetRequest.participantUserId,
      nonParticipantUserId: targetRequest.nonParticipantUserId,
    });

    await this.examScheduleRelation.update(
      {
        examScheduleId: targetRequest.examScheduleId,
        examReviewRoomId: createdRoom.id,
        createExamReviewRoomRequestId: null,
      },
      {
        where: { id: targetRequest.ExamScheduleRelation.id },
      }
    );

    await this.createExamReviewRoomRequestModel.destroy({
      where: { id: requestId },
    });

    return createdRoom;
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
