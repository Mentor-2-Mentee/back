import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Inject,
  CACHE_MANAGER,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { GetPastChatListDto } from "src/models";
import { LiveChatService } from "./live-chat.service";

@Controller("live-chat")
export class LiveChatController {
  constructor(
    private readonly liveChatService: LiveChatService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get()
  async getPastChatList(
    @Query("page") page: number,
    @Query("roomId") roomId: string,
    @Query("userId") userId: string
  ) {
    const querys: GetPastChatListDto = {
      page,
      roomId,
      userId,
    };
    console.log("/GET live-chat", querys);

    const pastChatListByPage = await this.liveChatService.getPastChatList(
      querys
    );

    return {
      data: pastChatListByPage,
      nextPage: Number(page) + 1,
    };
  }
}
