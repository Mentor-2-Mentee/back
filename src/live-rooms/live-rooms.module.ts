import { Module } from '@nestjs/common';
import { LiveRoomsService } from './live-rooms.service';
import { LiveRoomsController } from './live-rooms.controller';

@Module({
  controllers: [LiveRoomsController],
  providers: [LiveRoomsService]
})
export class LiveRoomsModule {}
