import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from "@nestjs/websockets";
import { LiveContentsService } from "./live-contents.service";
import {
  LiveChat,
  MentoringRoomChatSummary,
  SocketReceiveExamMentoringRoomDto,
  SocketReceiveLiveExamQuestionDto,
  SocketReceiveMentoringRoomLiveCanvasStroke,
  SocketReceiveMentoringRoomPrevCanvasStrokeList,
  SocketReceiveMentoringRoomPrevChatListDto,
} from "src/models";
import { Server } from "http";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ExamQuestionService } from "src/exam-question/exam-question.service";
import { ExamMentoringRoomService } from "src/exam-mentoring-room/exam-mentoring-room.service";

@WebSocketGateway(8081, {
  namespace: "/live-contents",
  path: "/websocket/",
  transports: ["websocket"],
})
export class LiveContentsGateway {
  constructor(
    private readonly liveChatService: LiveContentsService,
    private readonly examQuestionService: ExamQuestionService,
    private readonly examMentoringRoomService: ExamMentoringRoomService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("AppGateway");

  /**
   * 모든방에서의 이전 채팅 요청 수신 엔드포인트 => 특정 방에 입장하는 특정 유저에게 이전채팅을 발신
   * @param data : 이전 채팅로그 요청값.
   * Require: SocketReCeiveMentoringRoomPrevChatListDto
   */
  @SubscribeMessage("mentoringRoom_chatList_prev")
  async emitMentoringRoomPrevChatList(
    @MessageBody()
    data: SocketReceiveMentoringRoomPrevChatListDto
  ) {
    const targetChannel = `mentoringRoom_chatList_prev-${data.roomId}_${data.userId}`;
    const result = await this.liveChatService.getMentoringRoomPrevChatList(
      data
    );
    this.server.emit(targetChannel, result);
  }

  /**
   * 모든방에서의 실시간 채팅 수신 엔드포인트 => 특정 방에 실시간 채팅 발신
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
   * 모든방에 대한 이전 캔버스 stroke history 요청 수신 엔드포인트 => 특정방에 입장하는 특정 유저에게 캔버스 스넵샷{strokeHistory}을 발신
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
   * 모든방에서의 실시간 캔버스 stroke history 수신 엔드포인트 => 해당방에 실시간 캔버스 stroke를 발신
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

  /**
   * 모든 회사의 직군시험들에 대한 실시간 작성 내용 수신 엔드포인트 => 해당 회사의 특정 직군시험에 작성된 내용 발신
   * @param data : examScheduleId, examField, examQuestionIndex, examQuestion
   */
  @SubscribeMessage("examMentoringRoom_question_live")
  async emitExamMentoringRoomLiveQuestion(
    @MessageBody() data: SocketReceiveLiveExamQuestionDto
  ) {
    console.log(data);

    const targetChannel = `examMentoringRoom_question_live-${data.examScheduleId}_${data.examField}`;

    const updatedExamQuestion = await this.examQuestionService.updateQuestion(
      data.updateExamQuestionData
    );

    const result = {
      userId: data.userId,
      examScheduleId: data.examScheduleId,
      examField: data.examField,
      nowQuestionIndex: data.nowQuestionIndex,
      examQuestionData: updatedExamQuestion,
    };

    this.server.emit(targetChannel, result);
  }

  @SubscribeMessage("examMentoringRoom_question_prev")
  async emitExamMentoringRoomCurrentQuestion(
    @MessageBody() data: SocketReceiveExamMentoringRoomDto
  ) {
    console.log("examMentoringRoom_question_prev received data", data);

    const targetChannel = `examMentoringRoom_question_prev-${data.examScheduleId}_${data.examField}_${data.userId}`;

    const roomData =
      await this.examMentoringRoomService.findExamMentoringRoomOne(
        data.examScheduleId,
        data.examField
      );
    const examList = await this.examQuestionService.findQuestionAll(
      roomData.examQuestionList
    );

    const result = {
      examQuestionList: examList,
      liveWrittingUser: [],
      timer: data.timer,
    };

    this.server.emit(targetChannel, result);
  }

  @SubscribeMessage("examMentoringRoom_question_option")
  async emitUpdatedExamMentoringRoomQuestionOption(@MessageBody() data: any) {
    console.log("examMentoringRoom_question_option", data);

    const targetChannel = `examMentoringRoom_question_option-${data.examScheduleId}_${data.examField}`;

    const roomData =
      await this.examMentoringRoomService.findExamMentoringRoomOne(
        data.examScheduleId,
        data.examField
      );

    if (data.currentCount > data.newCount) {
      const deleteQuestionIdList = roomData.examQuestionList.slice(
        data.newCount
      );
      const remainedQuestionIdList = roomData.examQuestionList.slice(
        0,
        data.newCount
      );

      for (const deleteQuestionId of deleteQuestionIdList) {
        await this.examQuestionService.deleteQuestion(deleteQuestionId);
      }
      const updatedRoom =
        await this.examMentoringRoomService.updateExamMentoringRoomOne(
          data.examScheduleId,
          data.examField,
          {
            examQuestionList: remainedQuestionIdList,
          }
        );

      const examList = await this.examQuestionService.findQuestionAll(
        updatedRoom.examQuestionList
      );

      const result = {
        examQuestionList: examList,
        liveWrittingUser: [],
      };

      this.server.emit(targetChannel, result);
      return;
    }

    const updatedExamQuestion = await this.examQuestionService.findQuestionAll(
      roomData.examQuestionList
    );

    const result = {
      userId: data.userId,
      examScheduleId: data.examScheduleId,
      examField: data.examField,

      examQuestionList: updatedExamQuestion,
    };

    this.server.emit(targetChannel, result);
  }
}
