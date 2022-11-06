import { Test, TestingModule } from '@nestjs/testing';
import { ExamReviewRoomUserService } from './exam-review-room-user.service';

describe('ExamReviewRoomUserService', () => {
  let service: ExamReviewRoomUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamReviewRoomUserService],
    }).compile();

    service = module.get<ExamReviewRoomUserService>(ExamReviewRoomUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
