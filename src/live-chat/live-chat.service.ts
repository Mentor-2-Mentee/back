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
      const firstBundleId: string = uuidv4();
      const initialSummaryData: LiveRoomChatSummary = {
        maxBundlePage: 0,
        bundleIdList: [firstBundleId],
      };

      await this.cacheManager.set<LiveChat[]>(firstBundleId, [chatData]);
      await this.cacheManager.set<LiveRoomChatSummary>(
        chatData.roomId,
        initialSummaryData
      );
      return;
    }

    const recentChatBundleId =
      currentRoomCacheData.bundleIdList[currentRoomCacheData.maxBundlePage];
    const recentChatBundle = await this.cacheManager.get<LiveChat[]>(
      recentChatBundleId
    );

    for (const bundleId of currentRoomCacheData.bundleIdList) {
      const currentValue = await this.cacheManager.get<LiveChat[]>(bundleId);
      await this.cacheManager.set(bundleId, currentValue, { ttl: 3600 });
    }

    if (recentChatBundle.length >= 20) {
      const newBundleId = uuidv4();
      const newRoomCacheData: LiveRoomChatSummary = {
        maxBundlePage: currentRoomCacheData.maxBundlePage + 1,
        bundleIdList: [...currentRoomCacheData.bundleIdList, newBundleId],
      };

      await this.cacheManager.set<LiveRoomChatSummary>(
        chatData.roomId,
        newRoomCacheData
      );
      await this.cacheManager.set<LiveChat[]>(newBundleId, [chatData]);

      return;
    }

    await this.cacheManager.set<LiveChat[]>(recentChatBundleId, [
      ...recentChatBundle,
      chatData,
    ]);
  }

  async getPastChatList(getPastChatListDto: GetPastChatListDto) {
    const currentLiveRoomChatSummary =
      await this.cacheManager.get<LiveRoomChatSummary>(
        getPastChatListDto.roomId
      );
    const pastChatListByPage = await this.cacheManager.get<LiveChat[]>(
      currentLiveRoomChatSummary.bundleIdList[
        currentLiveRoomChatSummary.maxBundlePage - getPastChatListDto.page
      ]
    );

    return pastChatListByPage;
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
