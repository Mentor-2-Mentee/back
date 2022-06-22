import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from "@nestjs/websockets";
import { LiveChatService } from "./live-chat.service";
import { CreateLiveChatDto } from "./dto/create-live-chat.dto";
import { UpdateLiveChatDto } from "./dto/update-live-chat.dto";
import { Server } from "http";
import { Logger } from "@nestjs/common";
import { Socket } from "dgram";

@WebSocketGateway(8081, {
  namespace: "/live-chat",
  transports: ["websocket"],
  auth: {
    ["1234"]: "qwer",
  },
})
export class LiveChatGateway {
  constructor(private readonly liveChatService: LiveChatService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected : ${client}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected : ${client}`);
  }

  @SubscribeMessage("chatToServer")
  handleEvent(
    @MessageBody() data: any, // 클라이언트로부터 들어온 데이터
    @ConnectedSocket() client: Socket
  ) {
    console.log("챗받음:", data);

    this.server.emit("chatToClient", data);
    console.log("받은것 뿌림", data.text);
  }

  //RestAPI InitialConfigure
  // @SubscribeMessage("createLiveChat")
  // create(@MessageBody() createLiveChatDto: CreateLiveChatDto) {
  //   return this.liveChatService.create(createLiveChatDto);
  // }

  // @SubscribeMessage("findAllLiveChat")
  // findAll() {
  //   return this.liveChatService.findAll();
  // }

  // @SubscribeMessage("findOneLiveChat")
  // findOne(@MessageBody() id: number) {
  //   return this.liveChatService.findOne(id);
  // }

  // @SubscribeMessage("updateLiveChat")
  // update(@MessageBody() updateLiveChatDto: UpdateLiveChatDto) {
  //   return this.liveChatService.update(updateLiveChatDto.id, updateLiveChatDto);
  // }

  // @SubscribeMessage("removeLiveChat")
  // remove(@MessageBody() id: number) {
  //   return this.liveChatService.remove(id);
  // }
}
