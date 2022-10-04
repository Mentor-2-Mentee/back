import { Test, TestingModule } from '@nestjs/testing';
import { QuestionPostController } from './question-post.controller';
import { QuestionPostService } from './question-post.service';

describe('QuestionPostController', () => {
  let controller: QuestionPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionPostController],
      providers: [QuestionPostService],
    }).compile();

    controller = module.get<QuestionPostController>(QuestionPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
