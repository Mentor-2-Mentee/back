import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionCommentService } from './exam-question-comment.service';

describe('ExamQuestionCommentService', () => {
  let service: ExamQuestionCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamQuestionCommentService],
    }).compile();

    service = module.get<ExamQuestionCommentService>(ExamQuestionCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
