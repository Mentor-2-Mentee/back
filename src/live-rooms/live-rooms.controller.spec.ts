import { Test, TestingModule } from '@nestjs/testing';
import { LiveRoomsController } from './live-rooms.controller';
import { LiveRoomsService } from './live-rooms.service';

describe('LiveRoomsController', () => {
  let controller: LiveRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveRoomsController],
      providers: [LiveRoomsService],
    }).compile();

    controller = module.get<LiveRoomsController>(LiveRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
