import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { LiveChatService } from "./live-chat.service";
import {
  CreateLiveChatDto,
  GetPastChatListDto,
  LiveChat,
  LiveRoomChatSummary,
  UpdateLiveChatDto,
} from "src/models";
import { Server } from "http";
import { CACHE_MANAGER, Get, Inject, Logger } from "@nestjs/common";
import { Socket } from "dgram";
import { Cache } from "cache-manager";

const CACHE_TTL = {
  ttl: 3600,
};

@WebSocketGateway(8081, {
  namespace: "/live-chat",
  path: "/websocket/",
  transports: ["websocket"],
})
export class LiveChatGateway {
  constructor(
    private readonly liveChatService: LiveChatService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  @SubscribeMessage("getPreviousChatList")
  async sendChatLog(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      previousChatBundleIndex: "latest" | number;
    }
  ) {
    console.log(data);

    const previousChatList = await this.cacheManager.get<LiveRoomChatSummary>(
      data.roomId
    );

    this.server.emit(`previousChatList_${data.roomId}_${data.userId}`, {
      data: previousChatList.data,
      latestChatIndex: previousChatList.latestChatIndex,
    });
  }

  @SubscribeMessage("chatToServer")
  async handleEvent(
    @MessageBody() chatData: LiveChat,
    @ConnectedSocket() client: Socket
  ) {
    console.log("챗받음:", chatData.text);

    const currentRoomCacheData =
      await this.cacheManager.get<LiveRoomChatSummary | null>(chatData.roomId);

    const result = await this.liveChatService.saveChatLog(
      chatData,
      currentRoomCacheData
    );

    this.server.emit(`chatToClient_${chatData.roomId}`, {
      latestChatIndex: result.latestChatIndex,
      receivedChatData: chatData,
    });
  }
}
