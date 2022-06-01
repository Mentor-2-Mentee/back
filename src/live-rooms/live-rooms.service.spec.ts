import { Test, TestingModule } from '@nestjs/testing';
import { LiveRoomsService } from './live-rooms.service';

describe('LiveRoomsService', () => {
  let service: LiveRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveRoomsService],
    }).compile();

    service = module.get<LiveRoomsService>(LiveRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
