import { LiveChat } from "../entities";

export class SocketEmitMentoringRoomPrevChatList {
  latestChatIndex: number;
  previousChatListData: LiveChat[];
  targetTimeStamp: string;
  sendTime: number;
}
