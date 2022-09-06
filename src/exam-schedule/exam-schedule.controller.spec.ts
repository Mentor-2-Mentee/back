import { Test, TestingModule } from "@nestjs/testing";
import { TestScheduleController } from "./exam-schedule.controller";
import { TestScheduleService } from "./exam-schedule.service";

describe("TestScheduleController", () => {
  let controller: TestScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestScheduleController],
      providers: [TestScheduleService],
    }).compile();

    controller = module.get<TestScheduleController>(TestScheduleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
