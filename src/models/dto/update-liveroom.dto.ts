import { PartialType } from "@nestjs/mapped-types";
import { CreateLiveRoomDto } from "./create-liveroom.dto";

export class UpdateLiveRoomDto extends PartialType(CreateLiveRoomDto) {}
