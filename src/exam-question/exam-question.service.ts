import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import {
  CreateBulkExamQuestionDto,
  ExamQuestion,
  ExamQuestionComment,
  ExamReviewRoom,
  ExamSchedule,
  RawExamQuestion,
  UpdateExamQuestionDto,
  User,
} from "src/models";

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectModel(ExamQuestion)
    private examQuestionModel: typeof ExamQuestion,
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule,
    @InjectModel(ExamReviewRoom)
    private examReviewRoomModel: typeof ExamReviewRoom
  ) {}

  async createBulkQuestion({
    examReviewRoomId,
    bulkCount,
  }: CreateBulkExamQuestionDto) {
    const targetExamReviewRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );
    const relation = await targetExamReviewRoom.$get("ExamScheduleRelation");
    const parentSchedule = await relation.$get("examSchedule");
    const basement = [...Array(bulkCount).keys()].map(() => {
      return {
        questionText: null,
        questionImageUrl: [],
        answerExample: ["", "", "", "", ""],
        solution: "",
        answer: "",
        questionType: "MULTIPLE_CHOICE",
        examOrganizer: parentSchedule.organizer,
        examType: targetExamReviewRoom.examType,
      };
    });

    const newQuestionList = await this.examQuestionModel.bulkCreate(basement);
    const questionIdList = newQuestionList.map((question) => question.id);

    return questionIdList;
  }

  async deleteQuestion(examQuestionId: number) {
    const searchQuestionOption: WhereOptions = [];
    searchQuestionOption.push({
      ["examQuestionId"]: {
        [Op.and]: {
          [Op.eq]: examQuestionId,
        },
      },
    });

    await this.examQuestionModel.destroy({
      where: {
        [Op.and]: searchQuestionOption,
      },
    });
  }

  async updateQuestion({ id, questionText, solution }: UpdateExamQuestionDto) {
    await this.examQuestionModel.update(
      {
        questionText,
        solution,
      },
      {
        where: { id },
      }
    );

    return this.findQuestionById(id);
  }

  async findExamQuestionIdListByRoomId(examReviewRoomId: number) {
    const targetRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );

    return targetRoom.examQuestionId;
  }

  async findExamQuestionListByQuestionId(examQuestionIdList: number[]) {
    const result = [];
    for (const examQuestionId of examQuestionIdList) {
      const question = await this.examQuestionModel.findByPk(examQuestionId, {
        include: [
          { model: RawExamQuestion, include: [{ model: User }] },
          { model: ExamQuestionComment },
        ],
      });
      result.push(question);
    }

    return result;
  }

  async findQuestionById(examQuestionId: number) {
    const result = await this.examQuestionModel.findByPk(examQuestionId);
    return result;
  }
}
