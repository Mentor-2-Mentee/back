import { User } from "../entities";

export class CreateTestMentoringRoomDto {
  testScheduleId: number;
  testField: string;
  userList: User[];
}
