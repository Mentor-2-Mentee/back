import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import {
  CreateLiveChatDto,
  UpdateLiveChatDto,
  LiveChat,
  LiveRoomChatSummary,
  GetPastChatListDto,
} from "src/models";
import { v4 as uuidv4 } from "uuid";
import { Cache } from "cache-manager";

const CHAT_BUNDLE_SIZE = 20;

@Injectable()
export class LiveChatService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveChatLog(
    chatData: LiveChat,
    currentRoomCacheData: LiveRoomChatSummary | null
  ) {
    if (!currentRoomCacheData) {
      const configSummaryData: LiveRoomChatSummary = {
        latestChatIndex: 0,
        data: [chatData],
      };
      await this.cacheManager.set<LiveRoomChatSummary>(
        chatData.roomId,
        configSummaryData
      );
      return configSummaryData;
    }

    const saveData: LiveRoomChatSummary = {
      latestChatIndex: currentRoomCacheData.latestChatIndex + 1,
      data: [...currentRoomCacheData.data, chatData],
    };

    await this.cacheManager.set<LiveRoomChatSummary>(chatData.roomId, {
      latestChatIndex: currentRoomCacheData.latestChatIndex + 1,
      data: [...currentRoomCacheData.data, chatData],
    });

    return saveData;
  }

  async getPastChatListByPage(getPastChatListDto: GetPastChatListDto) {
    // const currentLiveRoomChatSummary =
    //   await this.cacheManager.get<LiveRoomChatSummary>(
    //     getPastChatListDto.roomId
    //   );
    // const pastChatListByPage = await this.cacheManager.get<LiveChat[]>(
    //   currentLiveRoomChatSummary.bundleIdList[
    //     getPastChatListDto.page === 0
    //       ? currentLiveRoomChatSummary.maxBundlePage
    //       : currentLiveRoomChatSummary.maxBundlePage - getPastChatListDto.page
    //   ]
    // );
    // return {
    //   pastChatListByPage: pastChatListByPage,
    //   maxBundlePage: currentLiveRoomChatSummary.maxBundlePage,
    // };
  }

  findAll() {
    console.log("모든 채팅내역 전송");
    return "asd";
  }

  findOne(id: number) {
    return `This action returns a #${id} liveChat`;
  }

  update(id: number, updateLiveChatDto: UpdateLiveChatDto) {
    return `This action updates a #${id} liveChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveChat`;
  }
}
