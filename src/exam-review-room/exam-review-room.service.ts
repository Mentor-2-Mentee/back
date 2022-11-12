import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateCreateExamReviewRoomRequestDto, User } from "src/models";
import {
  CreateExamReviewRoomRequest,
  ExamReviewRoom,
  ExamReviewRoomChat,
  ExamReviewRoomUser,
  ExamSchedule,
  ExamScheduleRelation,
  RawExamQuestion,
} from "src/models/entities";
import { Op } from "sequelize";
import { ExamQuestionService } from "src/exam-question/exam-question.service";
import * as PDFDocument from "pdfkit";
import DateFormatting from "src/common/utils/DateFormatting";
import { whereAndOptions } from "src/common/utils";

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
    private examScheduleRelation: typeof ExamScheduleRelation,
    @InjectModel(ExamReviewRoomUser)
    private examReviewRoomUserModel: typeof ExamReviewRoomUser,
    @InjectModel(ExamReviewRoomChat)
    private examReviewRoomChatModel: typeof ExamReviewRoomChat
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

  async deleteRoom(examReviewRoomId: number) {
    const targetExamReviewRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId,
      {
        include: [
          { model: ExamScheduleRelation },
          { model: ExamReviewRoomChat },
          { model: ExamReviewRoomUser },
        ],
      }
    );

    await this.examScheduleRelation.destroy({
      where: { id: targetExamReviewRoom.ExamScheduleRelation.id },
    });

    await this.examReviewRoomUserModel.destroy({
      where: {
        id: targetExamReviewRoom.examReviewRoomUsers.map(
          (roomUser) => roomUser.id
        ),
      },
    });

    await this.examReviewRoomModel.destroy({
      where: { id: targetExamReviewRoom.id },
    });
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
      examQuestionId: [],
      adminUserId: [adminUserId],
      participantUserId: targetRequest.participantUserId.filter(
        (currentUser) => currentUser !== adminUserId
      ),
      nonParticipantUserId: targetRequest.nonParticipantUserId.filter(
        (currentUser) => currentUser !== adminUserId
      ),
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

    const targetExamSchedule = await this.examScheduleModel.findByPk(
      targetRequest.examScheduleId
    );
    const initalQuestionIdList =
      await this.ExamQuestionService.createBulkQuestion(
        5,
        targetExamSchedule.organizer,
        targetRequest.examType
      );

    await this.examReviewRoomModel.update(
      {
        examQuestionId: initalQuestionIdList,
      },
      {
        where: { id: createdRoom.id },
      }
    );

    return createdRoom;
  }

  async findExamReviewRoomList(examScheduleId: number, userId?: string) {
    const examSchedule = await this.examScheduleModel.findByPk(examScheduleId);
    const examReviewRooms = await examSchedule.$get("examReviewRooms");

    const reformedRooms = [];
    for (const examReviewRoom of examReviewRooms) {
      const existUsers = await examReviewRoom.$get("examReviewRoomUsers");
      const currentUserIndex = existUsers.findIndex(
        (existUser) => existUser.userId === userId
      );
      reformedRooms.push({
        id: examReviewRoom.id,
        examType: examReviewRoom.examType,
        totalUserCount: existUsers.length,
        isParticipant:
          currentUserIndex === -1
            ? undefined
            : existUsers[currentUserIndex].isParticipant,
        userPosition:
          currentUserIndex === -1
            ? undefined
            : existUsers[currentUserIndex].userPosition,
        isClosed: examReviewRoom.isClosed,
      });
    }

    return reformedRooms;
  }

  async findExamReviewRoomHeadData(examReviewRoomId: number) {
    const targetRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );
    const targetSchedule = await targetRoom.$get("examSchedule");
    return {
      examOrganizer: targetSchedule.organizer,
      examType: targetRoom.examType,
      examDate: targetSchedule.examDate,
    };
  }

  async findExamReviewRoomOne(examReviewRoomId: number) {
    return await this.examReviewRoomModel.findByPk(examReviewRoomId);
  }

  async updateExamReviewRoomOne(examReviewRoomId: number, updateData?: any) {
    await this.examReviewRoomModel.update(
      {
        ...updateData,
      },
      {
        where: { id: examReviewRoomId },
      }
    );

    return await this.examReviewRoomModel.findByPk(examReviewRoomId);
  }

  async generateQuestionPDF(): // examReviewRoom?: ExamReviewRoom,
  // examQuestionIdList?: number[]
  Promise<Buffer> {
    // const examQuestionList =
    //   await this.ExamQuestionService.findExamQuestionListByQuestionId(
    //     examQuestionIdList
    //   );

    // const examDate = new DateFormatting(new Date(examReviewRoom.createdAt))
    //   .YYYY_MM_DD;

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
          "`${examReviewRoom.examSchedule.organizer} - ${examReviewRoom.examType} / ${examDate}`",
          50,
          50
        )
        .moveDown();

      //문제본문
      doc.fontSize(12);
      doc.text(
        `<p><br></p><p>기사문제 질문글 테스트</p><p><br></p><p><br></p><p><span class="ql-formula" data-value="asdf=qwer">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>a</mi><mi>s</mi><mi>d</mi><mi>f</mi><mo>=</mo><mi>q</mi><mi>w</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">asdf=qwer</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 0.8889em; vertical-align: -0.1944em;"></span><span class="mord mathnormal">a</span><span class="mord mathnormal">s</span><span class="mord mathnormal" style="margin-right: 0.1076em;">df</span><span class="mspace" style="margin-right: 0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right: 0.2778em;"></span></span><span class="base"><span class="strut" style="height: 0.625em; vertical-align: -0.1944em;"></span><span class="mord mathnormal" style="margin-right: 0.0269em;">qw</span><span class="mord mathnormal" style="margin-right: 0.0278em;">er</span></span></span></span></span>﻿</span></p><p><br></p><p><img src="http://localhost:3802/user_uploads/images/2022-10-24/8093f31c-94c1-4682-872c-ab9c51ad90fa.gif"></p><p><br></p><p><br></p>`
      );
      // examQuestionList.map((question, questionIndex) => {
      //   doc
      //     .text(`${questionIndex + 1}) ${question.questionText}`)
      //     .moveDown(0.5);

      //   if (question.questionImageUrl[0]) {
      //     const outerUrl = new RegExp(configuration().apiServerBaseURL);
      //     const filePath = question.questionImageUrl[0].replace(
      //       outerUrl,
      //       "public/"
      //     );
      //     doc
      //       .image(filePath, {
      //         height: 150,
      //         align: "center",
      //         valign: "center",
      //       })
      //       .moveDown(0.5);
      //   }

      //   question.answerExample.map((example, exampleIndex) => {
      //     doc.text(`${exampleIndex + 1}. ${example}`).moveDown(0.5);
      //   });
      //   doc.moveDown();
      // });

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
    const examQuestionList =
      await this.ExamQuestionService.findExamQuestionListByQuestionId(
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
}
