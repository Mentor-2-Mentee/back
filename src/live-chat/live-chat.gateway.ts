import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from "@nestjs/websockets";
import { LiveChatService } from "./live-chat.service";
import {
  LiveChat,
  MentoringRoomChatSummary,
  SocketReceiveMentoringRoomLiveCanvasStroke,
  SocketReceiveMentoringRoomPrevCanvasStrokeList,
  SocketReCeiveMentoringRoomPrevChatListDto,
} from "src/models";
import { Server } from "http";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";

@WebSocketGateway(8081, {
  namespace: "/live-contents",
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

  /**
   * 모든방에서의 이전 채팅 요청 수신 엔드포인트 => 특정 방에 입장하는 특정 유저가 이전채팅을 수신
   * @param data : 이전 채팅로그 요청값.
   * Require: SocketReCeiveMentoringRoomPrevChatListDto
   */
  @SubscribeMessage("mentoringRoom_chatList_prev")
  async emitMentoringRoomPrevChatList(
    @MessageBody()
    data: SocketReCeiveMentoringRoomPrevChatListDto
  ) {
    const targetChannel = `mentoringRoom_chatList_prev-${data.roomId}_${data.userId}`;
    const result = await this.liveChatService.getMentoringRoomPrevChatList(
      data
    );
    this.server.emit(targetChannel, result);
  }

  /**
   * 모든방에서의 실시간 채팅 수신 엔드포인트 => 특정 방 실시간 채팅 수신
   * @param chatData : 지금 보낸 채팅값
   * Require: LiveChat
   */
  @SubscribeMessage("mentoringRoom_chat_live")
  async emitMentoringRoomLiveChat(@MessageBody() chatData: LiveChat) {
    console.log(`${chatData.nickName} : ${chatData.text}`);
    const targetChannel = `mentoringRoom_chat_live-${chatData.roomId}`;
    const currentRoomCacheData =
      await this.cacheManager.get<MentoringRoomChatSummary | null>(
        chatData.roomId
      );
    const result = await this.liveChatService.saveChatLog(
      chatData,
      currentRoomCacheData
    );
    this.server.emit(targetChannel, result);
  }

  /**
   * 모든방에 대한 이전 캔버스 stroke history 요청 수신 엔드포인트 => 특정유저가 특정방 입장직전 캔버스 스넵샷{strokeHistory}을 수신
   * @param data : 입장하는 특정방, 입장하는 유저
   * Require: SocketReceiveMentoringRoomPrevCanvasStrokeList
   */
  @SubscribeMessage("mentoringRoom_canvas_strokeList_prev")
  async emitMentoringRoomPrevCanvasStrokeList(
    @MessageBody() data: SocketReceiveMentoringRoomPrevCanvasStrokeList
  ) {
    console.log("mentoringRoom_canvas_strokeList_prev", data);
    const targetChannel = `mentoringRoom_canvas_strokeList_prev-${data.roomId}_${data.userId}`;
  }

  /**
   * 모든방에서의 실시간 캔버스 stroke history 수신 엔드포인트 => 해당방에 실시간 캔버스 stroke를 수신
   * @param data : 현재 방, 작성한 유저
   */
  @SubscribeMessage("mentoringRoom_canvas_stroke_live")
  async emitMentoringRoomLiveCanvasStroke(
    @MessageBody() data: SocketReceiveMentoringRoomLiveCanvasStroke
  ) {
    console.log("mentoringRoom_canvas_stroke_live", data);
    const targetChannel = `mentoringRoom_canvas_stroke_live-${data.roomId}`;
    this.server.emit(targetChannel, data);
  }
}
