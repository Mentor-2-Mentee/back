import { Test, TestingModule } from '@nestjs/testing';
import { RawExamQuestionController } from './raw-exam-question.controller';
import { RawExamQuestionService } from './raw-exam-question.service';

describe('RawExamQuestionController', () => {
  let controller: RawExamQuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RawExamQuestionController],
      providers: [RawExamQuestionService],
    }).compile();

    controller = module.get<RawExamQuestionController>(RawExamQuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
