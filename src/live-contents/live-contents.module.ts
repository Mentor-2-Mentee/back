import { Module } from "@nestjs/common";
import { LiveContentsService } from "./live-contents.service";
import { LiveContentsGateway } from "./live-contents.gateway";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  providers: [LiveContentsGateway, LiveContentsService],
})
export class LiveChatModule {}
