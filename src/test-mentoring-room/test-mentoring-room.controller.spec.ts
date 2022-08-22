import { Test, TestingModule } from '@nestjs/testing';
import { TestMentoringRoomController } from './test-mentoring-room.controller';
import { TestMentoringRoomService } from './test-mentoring-room.service';

describe('TestMentoringRoomController', () => {
  let controller: TestMentoringRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestMentoringRoomController],
      providers: [TestMentoringRoomService],
    }).compile();

    controller = module.get<TestMentoringRoomController>(TestMentoringRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
