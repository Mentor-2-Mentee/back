import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionCommentController } from './exam-question-comment.controller';
import { ExamQuestionCommentService } from './exam-question-comment.service';

describe('ExamQuestionCommentController', () => {
  let controller: ExamQuestionCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionCommentController],
      providers: [ExamQuestionCommentService],
    }).compile();

    controller = module.get<ExamQuestionCommentController>(ExamQuestionCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
