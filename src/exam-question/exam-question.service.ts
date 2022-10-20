import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import {
  CreateBulkExamQuestionDto,
  ExamQuestion,
  ExamSchedule,
  UpdateExamQuestionDto,
} from "src/models";

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectModel(ExamQuestion)
    private examQuestionModel: typeof ExamQuestion,
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule
  ) {}

  async createBulkQuestion({
    examScheduleId,
    examType,
    bulkCount,
  }: CreateBulkExamQuestionDto) {
    const targetExamSchedule = await this.examScheduleModel.findByPk(
      examScheduleId
    );
    const basement = [...Array(bulkCount).keys()].map(() => {
      return {
        questionText: null,
        questionImageUrl: [],
        answerExample: ["", "", "", "", ""],
        solution: "",
        answer: "",
        questionType: "MULTIPLE_CHOICE",
        examOrganizer: targetExamSchedule.organizer,
        examType,
      };
    });
    const searchQuestionOption: WhereOptions = [];
    searchQuestionOption.push({
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

  async updateQuestion(updateExamQuestionDto: UpdateExamQuestionDto) {
    console.log("updateExamQuestionDto", updateExamQuestionDto);
    const searchQuestionOption: WhereOptions = [];
    searchQuestionOption.push({
      ["examQuestionId"]: {
        [Op.and]: {
          [Op.eq]: updateExamQuestionDto.examQuestionId,
        },
      },
    });

    await this.examQuestionModel.update(
      {
        ...updateExamQuestionDto,
      },
      {
        where: {
          [Op.and]: searchQuestionOption,
        },
      }
    );

    return this.findQuestionById(updateExamQuestionDto.examQuestionId);
  }

  async findQuestionAll(examQuestionIdList: number[]) {
    const result: ExamQuestion[] = [];

    for (const examQuestionId of examQuestionIdList) {
      const question = await this.examQuestionModel.findByPk(examQuestionId);
      result.push(question);
    }

    return result;
  }

  async findQuestionById(examQuestionId: number) {
    const result = await this.examQuestionModel.findByPk(examQuestionId);
    return result;
  }
}
