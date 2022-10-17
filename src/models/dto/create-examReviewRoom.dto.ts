import { User } from "../entities";

export class CreateExamReviewRoomDto {
  examScheduleTitle: string;
  examScheduleId: number;
  examType: string;
  userList: User[];
}
