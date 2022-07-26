import { Module } from "@nestjs/common";
import { LiveChatService } from "./live-chat.service";
import { LiveChatGateway } from "./live-chat.gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { LiveChatController } from "./live-chat.controller";

@Module({
  controllers: [LiveChatController],
  providers: [LiveChatGateway, LiveChatService],
})
export class LiveChatModule {}
