import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateExamScheduleDto,
  ExamReviewRoom,
  ExamSchedule,
  ExamScheduleRelation,
  UpdateExamScheduleDto,
} from "src/models";
import { Op, WhereOptions } from "sequelize";

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
    return examScheduleList;
  }

  async findExamScheduleById(examScheduleId: number) {
    return await this.examScheduleModel.findByPk(examScheduleId);
  }

  async updateExamSchedule(updateExamScheduleDto: UpdateExamScheduleDto) {
    const updateCount = await this.examScheduleModel.update(
      {
        ...updateExamScheduleDto,
      },
      { where: { id: updateExamScheduleDto.id } }
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
