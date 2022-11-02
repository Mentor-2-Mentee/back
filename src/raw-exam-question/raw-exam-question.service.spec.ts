import { Test, TestingModule } from '@nestjs/testing';
import { RawExamQuestionService } from './raw-exam-question.service';

describe('RawExamQuestionService', () => {
  let service: RawExamQuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RawExamQuestionService],
    }).compile();

    service = module.get<RawExamQuestionService>(RawExamQuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
