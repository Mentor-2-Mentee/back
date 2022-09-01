import { User } from "../entities";

export class CreateTestMentoringRoomDto {
  testScheduleId: number;
  requestTestField: string;
  userList: User[];
}
