import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveRoomsService } from './live-rooms.service';
import { CreateLiveRoomDto } from './dto/create-live-room.dto';
import { UpdateLiveRoomDto } from './dto/update-live-room.dto';

@Controller('live-rooms')
export class LiveRoomsController {
  constructor(private readonly liveRoomsService: LiveRoomsService) {}

  @Post()
  create(@Body() createLiveRoomDto: CreateLiveRoomDto) {
    return this.liveRoomsService.create(createLiveRoomDto);
  }

  @Get()
  findAll() {
    return this.liveRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liveRoomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiveRoomDto: UpdateLiveRoomDto) {
    return this.liveRoomsService.update(+id, updateLiveRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveRoomsService.remove(+id);
  }
}
