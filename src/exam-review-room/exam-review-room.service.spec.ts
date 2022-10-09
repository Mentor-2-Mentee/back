import { Test, TestingModule } from "@nestjs/testing";
import { ExamReviewRoomService } from "./exam-review-room.service";

describe("TestMentoringRoomService", () => {
  let service: ExamReviewRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamReviewRoomService],
    }).compile();

    service = module.get<ExamReviewRoomService>(ExamReviewRoomService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
