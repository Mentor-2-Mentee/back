import { User } from "../entities";

export class CreateExamMentoringRoomDto {
  examScheduleId: number;
  examField: string;
  userList: User[];
}
