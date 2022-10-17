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
  SocketReceiveExamReviewRoomDto,
  SocketReceiveLiveExamQuestionDto,
  SocketReceiveMentoringRoomLiveCanvasStroke,
  SocketReceiveMentoringRoomPrevCanvasStrokeList,
  SocketReceiveMentoringRoomPrevChatListDto,
} from "src/models";
import { Server } from "http";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ExamQuestionService } from "src/exam-question/exam-question.service";
import { ExamReviewRoomService } from "src/exam-review-room/exam-review-room.service";

@WebSocketGateway(8081, {
  namespace: "/live-contents",
  path: "/websocket/",
  transports: ["websocket"],
})
export class LiveContentsGateway {
  constructor(
    private readonly liveChatService: LiveContentsService,
    private readonly examQuestionService: ExamQuestionService,
    private readonly examReviewRoomService: ExamReviewRoomService,
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
    console.log(
      `${decodeURI(chatData.roomId)} | ${chatData.nickName} : ${chatData.text}`
    );
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
   * @param data : examScheduleId, examType, examQuestionIndex, examQuestion
   */
  @SubscribeMessage("examReviewRoom_question_live")
  async emitExamReviewRoomLiveQuestion(
    @MessageBody() data: SocketReceiveLiveExamQuestionDto
  ) {
    console.log(data);

    const targetChannel = `examReviewRoom_question_live-${data.examScheduleId}_${data.examType}`;

    const updatedExamQuestion = await this.examQuestionService.updateQuestion(
      data.updateExamQuestionData
    );

    const result = {
      userId: data.userId,
      examScheduleId: data.examScheduleId,
      examType: data.examType,
      nowQuestionIndex: data.nowQuestionIndex,
      examQuestionData: updatedExamQuestion,
    };

    this.server.emit(targetChannel, result);
  }

  @SubscribeMessage("examReviewRoom_question_prev")
  async emitExamReviewRoomCurrentQuestion(
    @MessageBody() data: SocketReceiveExamReviewRoomDto
  ) {
    console.log("examReviewRoom_question_prev received data", data);

    const targetChannel = `examReviewRoom_question_prev-${data.examScheduleId}_${data.examType}_${data.userId}`;

    const roomData = await this.examReviewRoomService.findExamReviewRoomOne(
      data.examScheduleId,
      data.examType
    );
    const examList = await this.examQuestionService.findQuestionAll(
      roomData.examQuestionId
    );

    const result = {
      examQuestionList: examList,
      liveWrittingUser: [],
      timer: data.timer,
    };

    console.log("result", targetChannel);

    this.server.emit(targetChannel, result);
  }

  @SubscribeMessage("examReviewRoom_question_option")
  async emitUpdatedExamReviewRoomQuestionOption(
    @MessageBody()
    {
      userId,
      examScheduleId,
      examType,
      setQuestionCount,
      deleteExamQuestionId,
    }: any
  ) {
    console.log(
      "examReviewRoom_question_option",
      setQuestionCount,
      deleteExamQuestionId
    );

    const targetChannel = `examReviewRoom_question_option-${examScheduleId}_${examType}`;

    const roomData = await this.examReviewRoomService.findExamReviewRoomOne(
      examScheduleId,
      examType
    );

    if (deleteExamQuestionId) {
      await this.examQuestionService.deleteQuestion(deleteExamQuestionId);

      const targetRoom = await this.examReviewRoomService.findExamReviewRoomOne(
        examScheduleId,
        examType
      );
      const remainedQuestionIdList = targetRoom.examQuestionId.filter(
        (quesionId) => quesionId !== deleteExamQuestionId
      );

      const updatedRoom =
        await this.examReviewRoomService.updateExamReviewRoomOne(
          examScheduleId,
          examType,
          {
            examQuestionList: remainedQuestionIdList,
          }
        );

      const examList = await this.examQuestionService.findQuestionAll(
        updatedRoom.examQuestionId
      );

      const result = {
        examQuestionList: examList,
        liveWrittingUser: [],
      };

      this.server.emit(targetChannel, result);
    }

    if (setQuestionCount) {
      if (setQuestionCount.currentCount > setQuestionCount.newCount) {
        const deleteQuestionIdList = roomData.examQuestionId.slice(
          setQuestionCount.newCount
        );
        const remainedQuestionIdList = roomData.examQuestionId.slice(
          0,
          setQuestionCount.newCount
        );

        for (const deleteQuestionId of deleteQuestionIdList) {
          await this.examQuestionService.deleteQuestion(deleteQuestionId);
        }
        const updatedRoom =
          await this.examReviewRoomService.updateExamReviewRoomOne(
            examScheduleId,
            examType,
            {
              examQuestionList: remainedQuestionIdList,
            }
          );

        const examList = await this.examQuestionService.findQuestionAll(
          updatedRoom.examQuestionId
        );

        const result = {
          examQuestionList: examList,
          liveWrittingUser: [],
        };

        this.server.emit(targetChannel, result);
        return;
      }

      if (setQuestionCount.currentCount < setQuestionCount.newCount) {
        const createBulkCount =
          setQuestionCount.newCount - setQuestionCount.currentCount;

        if (createBulkCount > 200) throw new Error("too much require!!");
        const createdNewQuestionIdList =
          await this.examQuestionService.createBulkQuestion({
            examScheduleId,
            examType,
            bulkCount: createBulkCount,
          });

        const updatedRoom =
          await this.examReviewRoomService.updateExamReviewRoomOne(
            examScheduleId,
            examType,
            {
              examQuestionList: createdNewQuestionIdList,
            }
          );

        const examList = await this.examQuestionService.findQuestionAll(
          updatedRoom.examQuestionId
        );

        const result = {
          examQuestionList: examList,
          liveWrittingUser: [],
        };

        this.server.emit(targetChannel, result);
        return;
      }
    }
  }
}
