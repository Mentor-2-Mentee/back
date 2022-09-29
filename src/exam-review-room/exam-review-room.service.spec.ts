import { Test, TestingModule } from "@nestjs/testing";
import { TestMentoringRoomService } from "./exam-review-room.service";

describe("TestMentoringRoomService", () => {
  let service: TestMentoringRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestMentoringRoomService],
    }).compile();

    service = module.get<TestMentoringRoomService>(TestMentoringRoomService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
