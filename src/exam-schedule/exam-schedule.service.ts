import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateExamScheduleDto,
  ExamReviewRoom,
  ExamSchedule,
  ExamScheduleRelation,
  UpdateExamScheduleDto,
  User,
} from "src/models";
import { Op, WhereOptions } from "sequelize";
import * as PDFDocument from "pdfkit";
import configuration from "src/common/config/configuration";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ExamScheduleService {
  constructor(
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule
  ) {}

  async createExamSchedule(createExamScheduleDto: CreateExamScheduleDto) {
    const savedExamSchedule = await this.examScheduleModel.create({
      ...createExamScheduleDto,
    });

    return savedExamSchedule;
  }

  async findExamScheduleByDateRange(startDate: Date, endDate: Date) {
    const searchExamScheduleQuerys: WhereOptions = [];

    searchExamScheduleQuerys.push({
      ["examDate"]: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });

    const examScheduleList = await this.examScheduleModel.findAll({
      include: [{ model: ExamReviewRoom }, { model: ExamScheduleRelation }],
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
    });

    console.log("examScheduleList", examScheduleList.length);

    return examScheduleList;
  }

  async findExamScheduleById(examScheduleId: number) {
    return await this.examScheduleModel.findByPk(examScheduleId);
  }

  async updateExamSchedule(updateExamScheduleDto: UpdateExamScheduleDto) {
    const updateCount = await this.examScheduleModel.update(
      { ...updateExamScheduleDto },
      {
        where: { id: updateExamScheduleDto.id },
      }
    );
    return Boolean(updateCount);
  }

  async deleteExamSchedule(examScheduleId: number) {
    const { organizer } = await this.examScheduleModel.findByPk(examScheduleId);
    await this.examScheduleModel.destroy({
      where: { id: examScheduleId },
    });
    return organizer;
  }
}
