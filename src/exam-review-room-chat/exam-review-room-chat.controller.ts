import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthorizeUserProfile } from "src/models";
import { JwtAuthGuard } from "src/oauth/jwt/jwt-auth.guard";
import { ExamReviewRoomChatService } from "./exam-review-room-chat.service";

@Controller("exam-review-room-chat")
export class ExamReviewRoomChatController {
  constructor(
    private readonly examReviewRoomChatService: ExamReviewRoomChatService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getChatList(
    @Req() { user }: AuthorizeUserProfile,
    @Query("examReviewRoomId") examReviewRoomId: string,
    @Query("oldestChatId") oldestChatId: string,
    @Query("limit") limit: string
  ) {
    console.log(user.userName, examReviewRoomId, oldestChatId, limit);

    const chatList = await this.examReviewRoomChatService.findChatList(
      Number(examReviewRoomId),
      Number(oldestChatId),
      Number(limit)
    );

    return {
      message: "OK",
      chatList,
    };
  }
}
