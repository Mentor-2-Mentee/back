import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order, WhereOptions } from "sequelize/types";
import {
  CreateTestScheduleDto,
  TestSchedule,
  UpdateTestScheduleDto,
  User,
} from "src/models";
import { Sequelize, Op } from "sequelize";
import * as PDFDocument from "pdfkit";

@Injectable()
export class TestScheduleService {
  constructor(
    @InjectModel(TestSchedule)
    private testScheduleModel: typeof TestSchedule
  ) {}

  async createTestSchedule(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    createTestScheduleDto: CreateTestScheduleDto,
    imageFiles: Express.Multer.File[]
  ) {
    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = imageFile.path.replace(rootDirName, "");
      imagesPath.push(savedPath);
    });
    Object.entries(createTestScheduleDto).map(([key, value]) => {
      createTestScheduleDto[key] = JSON.parse(value);
    });

    const savedTestSchedule = await this.testScheduleModel.create({
      testScheduleTitle: createTestScheduleDto.testScheduleTitle,
      testUrl: createTestScheduleDto.testUrl,
      testDate: createTestScheduleDto.testDate,
      testField: createTestScheduleDto.testField,
      testDescription: createTestScheduleDto.testDescription,
      imageFiles: imagesPath,
    });

    return savedTestSchedule;
  }

  async findTestScheduleByDateRange(startDate: Date, endDate: Date) {
    const searchTestScheduleQuerys: WhereOptions = [];

    searchTestScheduleQuerys.push({
      ["testDate"]: {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });

    const testScheduleList = await this.testScheduleModel.findAll({
      where: {
        [Op.and]: searchTestScheduleQuerys,
      },
    });

    return testScheduleList;
  }

  async findTestScheduleById(testScheduleId: number) {
    const searchTestScheduleQuerys: WhereOptions = [];
    searchTestScheduleQuerys.push({
      ["testScheduleId"]: {
        [Op.eq]: testScheduleId,
      },
    });

    const testSchedule = await this.testScheduleModel.findOne({
      where: {
        [Op.and]: searchTestScheduleQuerys,
      },
    });

    return testSchedule;
  }

  async updateTestSchedule(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    updateTestScheduleDto: UpdateTestScheduleDto,
    imageFiles: Express.Multer.File[]
  ) {
    const searchTestScheduleQuerys: WhereOptions = [];

    searchTestScheduleQuerys.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: updateTestScheduleDto.testScheduleId,
        },
      },
    });

    const imagesPath = [];

    imageFiles.map((imageFile) => {
      const rootDirName = new RegExp("public/");
      const savedPath = imageFile.path.replace(rootDirName, "");
      imagesPath.push(savedPath);
    });
    Object.entries(updateTestScheduleDto).map(([key, value]) => {
      updateTestScheduleDto[key] = JSON.parse(value);
    });

    await this.testScheduleModel.update(
      {
        testScheduleTitle: updateTestScheduleDto.testScheduleTitle,
        testUrl: updateTestScheduleDto.testUrl,
        testDate: updateTestScheduleDto.testDate,
        testField: updateTestScheduleDto.testField,
        testDescription: updateTestScheduleDto.testDescription,
        imageFiles: imagesPath,
      },
      {
        where: {
          [Op.and]: searchTestScheduleQuerys,
        },
      }
    );
  }

  async deleteTestSchedule(
    userData: Pick<User, "userId" | "username" | "userGrade">,
    testScheduleId: number
  ) {
    const searchTestScheduleQuerys: WhereOptions = [];
    searchTestScheduleQuerys.push({
      ["testScheduleId"]: {
        [Op.and]: {
          [Op.eq]: testScheduleId,
        },
      },
    });

    await this.testScheduleModel.destroy({
      where: {
        [Op.and]: searchTestScheduleQuerys,
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
