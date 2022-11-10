import { Controller } from '@nestjs/common';
import { ExamReviewRoomChatService } from './exam-review-room-chat.service';

@Controller('exam-review-room-chat')
export class ExamReviewRoomChatController {
  constructor(private readonly examReviewRoomChatService: ExamReviewRoomChatService) {}
}
