import { User } from "../entities";

export class CreateExamMentoringRoomDto {
  examScheduleTitle: string;
  examScheduleId: number;
  examField: string;
  userList: User[];
}
