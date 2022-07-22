import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { LiveChatService } from "./live-chat.service";
import { CreateLiveChatDto, UpdateLiveChatDto } from "src/models";
import { Server } from "http";
import { Logger } from "@nestjs/common";
import { Socket } from "dgram";

@WebSocketGateway(8081, {
  namespace: "/live-chat",
  path: "/websocket/",
  transports: ["websocket"],
})
export class LiveChatGateway {
  constructor(private readonly liveChatService: LiveChatService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  @SubscribeMessage("getBeforeMessages")
  async sendChatLog(@MessageBody() data: any) {
    console.log(data);

    this.server.emit(`chatToClient_${data.roomId}`, [
      // roomId + uid를 이용하면 특정 사용자의 특정 톡방에만 emit 가능
      "소켓으로",
      "원하는순간에",
      "데이터보내기",
    ]);
  }

  @SubscribeMessage("chatToServer")
  handleEvent(
    @MessageBody() data: any, // 클라이언트로부터 들어온 데이터
    @ConnectedSocket() client: Socket
  ) {
    console.log("챗받음:", data, client.address);

    this.server.emit(`chatToClient_${data.roomId}`, data);
    console.log("받은것 뿌림", data.text);
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
