import { Test, TestingModule } from '@nestjs/testing';
import { ExamReviewRoomChatController } from './exam-review-room-chat.controller';
import { ExamReviewRoomChatService } from './exam-review-room-chat.service';

describe('ExamReviewRoomChatController', () => {
  let controller: ExamReviewRoomChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamReviewRoomChatController],
      providers: [ExamReviewRoomChatService],
    }).compile();

    controller = module.get<ExamReviewRoomChatController>(ExamReviewRoomChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
