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

  async createExamSchedule(
    userData: Pick<User, "id" | "userName" | "userGrade">,
    createExamScheduleDto: CreateExamScheduleDto,
    imageFiles: Express.Multer.File[]
  ) {
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = `${
        configuration().apiServerBaseURL
      }/${imageFile.path.replace(rootDirName, "")}`;

      imagesPath.push(savedPath);
    });
    Object.entries(createExamScheduleDto).map(([key, value]) => {
      createExamScheduleDto[key] = JSON.parse(value);
    });

    const savedExamSchedule = await this.examScheduleModel.create({
      examScheduleTitle: createExamScheduleDto.examScheduleTitle,
      examUrl: createExamScheduleDto.examUrl,
      examDate: createExamScheduleDto.examDate,
      examType: createExamScheduleDto.examType,
      examDescription: createExamScheduleDto.examDescription,
      imageFiles: imagesPath,
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

    console.log("searchQuery", startDate, endDate);

    const examScheduleList = await this.examScheduleModel.findAll({
      include: [{ model: ExamReviewRoom }, { model: ExamScheduleRelation }],
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
      // plain: true,
    });

    console.log(examScheduleList[0]);

    // for (const examSchedule of examScheduleList) {
    //   // examSchedule.examScheduleRelations.map(relation => {
    //   //   relation.
    //   // })
    // }

    console.log("examScheduleList", examScheduleList.length);

    return examScheduleList;
  }

  async findExamScheduleById(examScheduleId: number) {
    return await this.examScheduleModel.findByPk(examScheduleId);
  }

  async updateExamSchedule(
    userData: Pick<User, "id" | "userName" | "userGrade">,
    updateExamScheduleDto: UpdateExamScheduleDto,
    imageFiles: Express.Multer.File[]
  ) {
    const searchExamScheduleQuerys: WhereOptions = [];

    searchExamScheduleQuerys.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: updateExamScheduleDto.examScheduleId,
        },
      },
    });

    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = `${
        configuration().apiServerBaseURL
      }/${imageFile.path.replace(rootDirName, "")}`;
      imagesPath.push(savedPath);
    });
    Object.entries(updateExamScheduleDto).map(([key, value]) => {
      updateExamScheduleDto[key] = JSON.parse(value);
    });

    await this.examScheduleModel.update(
      {
        examScheduleTitle: updateExamScheduleDto.examScheduleTitle,
        examUrl: updateExamScheduleDto.examUrl,
        examDate: updateExamScheduleDto.examDate,
        examType: updateExamScheduleDto.examType,
        examDescription: updateExamScheduleDto.examDescription,
        imageFiles: imagesPath,
      },
      {
        where: {
          [Op.and]: searchExamScheduleQuerys,
        },
      }
    );
  }

  async deleteExamSchedule(
    userData: Pick<User, "id" | "userName" | "userGrade">,
    examScheduleId: number
  ) {
    const searchExamScheduleQuerys: WhereOptions = [];
    searchExamScheduleQuerys.push({
      ["examScheduleId"]: {
        [Op.and]: {
          [Op.eq]: examScheduleId,
        },
      },
    });

    const { organizer } = await this.examScheduleModel.findByPk(examScheduleId);

    await this.examScheduleModel.destroy({
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
    });

    return organizer;
  }
}
