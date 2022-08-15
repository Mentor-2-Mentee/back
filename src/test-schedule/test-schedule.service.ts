import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TestSchedule } from "src/models";
import { CreateTestScheduleDto } from "./dto/create-test-schedule.dto";
import { UpdateTestScheduleDto } from "./dto/update-test-schedule.dto";

@Injectable()
export class TestScheduleService {
  constructor(
    @InjectModel(TestSchedule)
    private liveRoomModel: typeof TestSchedule
  ) {}

  async createTestSchedule(createTestScheduleDto: CreateTestScheduleDto) {
    return "This action adds a new testSchedule";
  }

  findAll() {
    return `This action returns all testSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testSchedule`;
  }

  update(id: number, updateTestScheduleDto: UpdateTestScheduleDto) {
    return `This action updates a #${id} testSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} testSchedule`;
  }
}
