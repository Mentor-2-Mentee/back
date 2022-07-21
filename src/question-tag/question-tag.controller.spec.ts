import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTagController } from './question-tag.controller';
import { QuestionTagService } from './question-tag.service';

describe('QuestionTagController', () => {
  let controller: QuestionTagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionTagController],
      providers: [QuestionTagService],
    }).compile();

    controller = module.get<QuestionTagController>(QuestionTagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
