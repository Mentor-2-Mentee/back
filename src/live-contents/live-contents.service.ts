import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import {
  LiveChat,
  MentoringRoomChatSummary,
  SocketReCeiveMentoringRoomPrevChatListDto,
  SocketEmitMentoringRoomPrevChatList,
  SocketEmitMentoringRoomLiveChat,
} from "src/models";
import { Cache } from "cache-manager";

const CHAT_BUNDLE_SIZE = 20;

@Injectable()
export class LiveContentsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveChatLog(
    chatData: LiveChat,
    currentRoomCacheData: MentoringRoomChatSummary | null
  ): Promise<SocketEmitMentoringRoomLiveChat> {
    if (!currentRoomCacheData) {
      const configSummaryData: MentoringRoomChatSummary = {
        latestChatIndex: 0,
        data: [chatData],
      };
      await this.cacheManager.set<MentoringRoomChatSummary>(
        chatData.roomId,
        configSummaryData
      );
      return {
        latestChatIndex: configSummaryData.latestChatIndex,
        receivedChatData: chatData,
      };
    }

    const saveData: MentoringRoomChatSummary = {
      latestChatIndex: currentRoomCacheData.latestChatIndex + 1,
      data: [...currentRoomCacheData.data, chatData],
    };

    await this.cacheManager.set<MentoringRoomChatSummary>(chatData.roomId, {
      latestChatIndex: currentRoomCacheData.latestChatIndex + 1,
      data: [...currentRoomCacheData.data, chatData],
    });

    return {
      latestChatIndex: saveData.latestChatIndex,
      receivedChatData: chatData,
    };
  }

  spliceChatList(
    targetTimeStamp: string,
    rawChatList: LiveChat[],
    limit = 10
  ): LiveChat[] {
    const targetChatIndex =
      targetTimeStamp === "latest"
        ? rawChatList.length
        : rawChatList.findIndex(
            (chatElement) => chatElement.createdAt === targetTimeStamp
          );

    const startIndex =
      targetChatIndex - limit < 0 ? 0 : targetChatIndex - limit;

    return rawChatList.slice(startIndex, targetChatIndex);
  }

  async getMentoringRoomPrevChatList(
    data: SocketReCeiveMentoringRoomPrevChatListDto
  ): Promise<SocketEmitMentoringRoomPrevChatList> {
    const mentoringRoomSummaryData =
      await this.cacheManager.get<MentoringRoomChatSummary>(data.roomId);

    if (!mentoringRoomSummaryData || !mentoringRoomSummaryData.data) {
      return {
        latestChatIndex: -1,
        previousChatListData: [],
        targetTimeStamp: undefined,
        sendTime: data.sendTime,
      };
    }

    const splicedChatList = this.spliceChatList(
      data.targetTimeStamp,
      mentoringRoomSummaryData.data,
      data.limit
    );

    return {
      latestChatIndex: mentoringRoomSummaryData.latestChatIndex,
      previousChatListData: splicedChatList,
      targetTimeStamp: data.targetTimeStamp,
      sendTime: data.sendTime,
    };
  }
}
