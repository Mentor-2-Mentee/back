import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order, WhereOptions } from "sequelize/types";
import {
  CreateExamScheduleDto,
  ExamSchedule,
  UpdateExamScheduleDto,
  User,
} from "src/models";
import { Sequelize, Op } from "sequelize";
import * as PDFDocument from "pdfkit";
import configuration from "src/common/config/configuration";

@Injectable()
export class ExamScheduleService {
  constructor(
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule
  ) {}

  async createExamSchedule(
    userData: Pick<User, "userId" | "username" | "userGrade">,
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
      examField: createExamScheduleDto.examField,
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

    const examScheduleList = await this.examScheduleModel.findAll({
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
    });

    return examScheduleList;
  }

  async findExamScheduleById(examScheduleId: number) {
    const searchExamScheduleQuerys: WhereOptions = [];
    searchExamScheduleQuerys.push({
      ["examScheduleId"]: {
        [Op.eq]: examScheduleId,
      },
    });

    const examSchedule = await this.examScheduleModel.findOne({
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
    });

    return examSchedule;
  }

  async updateExamSchedule(
    userData: Pick<User, "userId" | "username" | "userGrade">,
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
      const savedPath = imageFile.path.replace(rootDirName, "");
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
        examField: updateExamScheduleDto.examField,
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
    userData: Pick<User, "userId" | "username" | "userGrade">,
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

    await this.examScheduleModel.destroy({
      where: {
        [Op.and]: searchExamScheduleQuerys,
      },
    });
  }

  async generatePDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size: "LETTER",
        bufferPages: true,
      });

      // customize your PDF document
      doc.text("hello world", 100, 50);
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
