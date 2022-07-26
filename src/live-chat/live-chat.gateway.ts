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

  @SubscribeMessage("getPastChatList")
  async sendChatLog(@MessageBody() data: any) {
    console.log(data);

    const currentLiveRoomChatSummary =
      await this.cacheManager.get<LiveRoomChatSummary>(data.roomId);
    const pastChatListByPage = await this.cacheManager.get<LiveChat[]>(
      currentLiveRoomChatSummary.bundleIdList[
        currentLiveRoomChatSummary.maxBundlePage - data.page
      ]
    );

    this.server.emit(
      `getPastChatList_${data.roomId}_${data.userId}`,
      pastChatListByPage
    );
  }

  @SubscribeMessage("chatToServer")
  async handleEvent(
    @MessageBody() chatData: LiveChat, // 클라이언트로부터 들어온 데이터
    @ConnectedSocket() client: Socket
  ) {
    console.log("챗받음:", chatData.text);
    this.server.emit(`chatToClient_${chatData.roomId}`, chatData);

    const currentRoomCacheData =
      await this.cacheManager.get<LiveRoomChatSummary | null>(chatData.roomId);

    await this.liveChatService.saveChatLog(chatData, currentRoomCacheData);
  }

  // afterInit(server: Server) {
  //   this.logger.log("Init");
  // }

  // handleDisconnect(client: Socket) {
  //   this.logger.log(`Client Disconnected : ${client}`);
  // }

  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`Client Connected : ${client}`);
  // }
}
