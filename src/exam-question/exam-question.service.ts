import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import {
  CreateBulkExamQuestionDto,
  ExamQuestion,
  UpdateExamQuestionDto,
} from "src/models";

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectModel(ExamQuestion)
    private examQuestionModel: typeof ExamQuestion
  ) {}

  async createBulkQuestion({
    examScheduleId,
    examField,
    bulkCount,
  }: CreateBulkExamQuestionDto) {
    const basement = [...Array(bulkCount).keys()].map(() => {
      return {
        answerExampleList: ["", "", "", "", ""],
        questionType: "MULTIPLE_CHOICE",
        examScheduleId,
        examField,
      };
    });
    const searchQuestionOption: WhereOptions = [];
    searchQuestionOption.push({
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

    await this.examQuestionModel.bulkCreate(basement);
    const newQuestionList = await this.examQuestionModel.findAll({
      where: {
        [Op.and]: searchQuestionOption,
      },
    });

    const questionIdList = newQuestionList.map(
      (question) => question.examQuestionId
    );

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
