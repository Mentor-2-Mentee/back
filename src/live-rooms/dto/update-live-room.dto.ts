import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveRoomDto } from './create-live-room.dto';

export class UpdateLiveRoomDto extends PartialType(CreateLiveRoomDto) {}
