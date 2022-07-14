import { FilterOption } from "../entities/filterOption.entity";

export class GetLiveRoomDto {
  page: number;
  limit: number;
  filter?: FilterOption;
}
