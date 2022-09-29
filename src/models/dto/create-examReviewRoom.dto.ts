import { User } from "../entities";

export class CreateExamReviewRoomDto {
  examScheduleTitle: string;
  examScheduleId: number;
  examField: string;
  userList: User[];
}
