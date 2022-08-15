import { Test, TestingModule } from '@nestjs/testing';
import { TestScheduleService } from './test-schedule.service';

describe('TestScheduleService', () => {
  let service: TestScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestScheduleService],
    }).compile();

    service = module.get<TestScheduleService>(TestScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
