import { Test, TestingModule } from '@nestjs/testing';
import { QuestionPostService } from './question-post.service';

describe('QuestionPostService', () => {
  let service: QuestionPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionPostService],
    }).compile();

    service = module.get<QuestionPostService>(QuestionPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
