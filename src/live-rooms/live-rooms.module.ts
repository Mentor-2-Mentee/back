import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { LiveRoomsController } from "./live-rooms.controller";
import { OauthModule } from "src/oauth/oauth.module";

@Module({
  imports: [OauthModule],
  controllers: [LiveRoomsController],
  providers: [LiveRoomsService],
})
export class LiveRoomsModule {}
