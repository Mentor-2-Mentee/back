export class SocketReCeiveMentoringRoomPrevChatListDto {
  roomId: string;
  userId: string;
  limit: number;
  targetTimeStamp: string | "latest";
  sendTime: number;
}
