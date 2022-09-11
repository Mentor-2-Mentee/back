export class SocketReceiveMentoringRoomPrevChatListDto {
  roomId: string;
  userId: string;
  limit: number;
  targetTimeStamp: string | "latest";
  sendTime: number;
}
