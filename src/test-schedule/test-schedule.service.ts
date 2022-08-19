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

    const updatedTestSchedule = await this.testScheduleModel.update(
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

    return updatedTestSchedule;
  }

  findAll() {
    return `This action returns all testSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testSchedule`;
  }

  update(id: number, updateTestScheduleDto: any) {
    return `This action updates a #${id} testSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} testSchedule`;
  }
}
