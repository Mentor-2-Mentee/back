import { Test, TestingModule } from '@nestjs/testing';
import { ExamReviewRoomChatService } from './exam-review-room-chat.service';

describe('ExamReviewRoomChatService', () => {
  let service: ExamReviewRoomChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamReviewRoomChatService],
    }).compile();

    service = module.get<ExamReviewRoomChatService>(ExamReviewRoomChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
