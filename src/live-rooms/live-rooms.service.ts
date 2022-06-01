import { Injectable } from '@nestjs/common';
import { CreateLiveRoomDto } from './dto/create-live-room.dto';
import { UpdateLiveRoomDto } from './dto/update-live-room.dto';

@Injectable()
export class LiveRoomsService {
  create(createLiveRoomDto: CreateLiveRoomDto) {
    return 'This action adds a new liveRoom';
  }

  findAll() {
    return `This action returns all liveRooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} liveRoom`;
  }

  update(id: number, updateLiveRoomDto: UpdateLiveRoomDto) {
    return `This action updates a #${id} liveRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveRoom`;
  }
}
