import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTagService } from './question-tag.service';

describe('QuestionTagService', () => {
  let service: QuestionTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionTagService],
    }).compile();

    service = module.get<QuestionTagService>(QuestionTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
