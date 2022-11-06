import { Test, TestingModule } from '@nestjs/testing';
import { ExamReviewRoomUserController } from './exam-review-room-user.controller';
import { ExamReviewRoomUserService } from './exam-review-room-user.service';

describe('ExamReviewRoomUserController', () => {
  let controller: ExamReviewRoomUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamReviewRoomUserController],
      providers: [ExamReviewRoomUserService],
    }).compile();

    controller = module.get<ExamReviewRoomUserController>(ExamReviewRoomUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
