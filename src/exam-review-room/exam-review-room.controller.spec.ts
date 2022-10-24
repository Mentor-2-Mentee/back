import { Test, TestingModule } from "@nestjs/testing";
import { ExamReviewRoomController } from "./exam-review-room.controller";
import { ExamReviewRoomService } from "./exam-review-room.service";

describe("TestMentoringRoomController", () => {
  let controller: ExamReviewRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamReviewRoomController],
      providers: [ExamReviewRoomService],
    }).compile();

    controller = module.get<ExamReviewRoomController>(ExamReviewRoomController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
