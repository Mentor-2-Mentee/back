import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import {
  CreateBulkExamQuestionDto,
  ExamQuestion,
  UpdateExamQuestionDto,
} from "src/models";

const INITIAL_QUESTION = {};

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
  }
}
