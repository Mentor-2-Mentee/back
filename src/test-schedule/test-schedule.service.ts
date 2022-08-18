import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order, WhereOptions } from "sequelize/types";
import { CreateTestScheduleDto, TestSchedule, User } from "src/models";
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

  async findTestScheduleByDateRange(
    startDate: Date,
    endDate: Date,
    option = "INCREASE"
  ) {
    const searchTestScheduleQuerys: WhereOptions = [];
    const orderOption: Order = [];

    switch (option) {
      case "INCREASE":
        orderOption.push(["createdAt", "ASC"]);
        break;
      case "DECREASE":
        orderOption.push(["createdAt", "DESC"]);
      default:
        orderOption.push(["createdAt", "DESC"]);
        break;
    }

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
      order: orderOption,
    });

    return testScheduleList;
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
