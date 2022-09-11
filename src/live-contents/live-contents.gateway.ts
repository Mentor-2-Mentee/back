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
  SocketReceiveLiveExamQuestionDto,
  SocketReceiveMentoringRoomLiveCanvasStroke,
  SocketReceiveMentoringRoomPrevCanvasStrokeList,
  SocketReceiveMentoringRoomPrevChatListDto,
} from "src/models";
import { Server } from "http";
import { CACHE_MANAGER, Inject, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ExamQuestionService } from "src/exam-question/exam-question.service";

@WebSocketGateway(8081, {
  namespace: "/live-contents",
  path: "/websocket/",
  transports: ["websocket"],
})
export class LiveContentsGateway {
  constructor(
    private readonly liveChatService: LiveContentsService,
    private readonly examQuestionService: ExamQuestionService,
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

    await this.examQuestionService.updateQuestion(data.updateExamQuestionData);

    const result = {
      userId: data.userId,
      examScheduleId: data.examScheduleId,
      examField: data.examField,
      nowQuestionIndex: data.nowQuestionIndex,
      examQuestion: TEST_DATA[data.nowQuestionIndex],
    };

    this.server.emit(targetChannel, result);
  }

  @SubscribeMessage("examMentoringRoom_question_prev")
  async emitExamMentoringRoomCurrentQuestion(@MessageBody() data: any) {
    console.log("examMentoringRoom_question_prev received data", data);

    const targetChannel = `examMentoringRoom_question_prev-${data.examScheduleId}_${data.examField}_${data.userId}`;

    const result = {
      examQuestionList: TEST_DATA,
      liveWrittingUser: [],
      timer: data.timer,
    };

    this.server.emit(targetChannel, result);
  }
}

const TEST_DATA = [
  {
    examQuestionId: 41,
    questionText: "4+5는?",
    answerExampleList: ["5", "7", "9", "11", "13"],
    answer: "3번",
    questionImagesUrl: [],
    solution: "4에다가 5를 더하면 9가된다.",
    questionType: "MULTIPLE_CHOICE",
  },
  {
    examQuestionId: 42,
    questionText: "아몬드가 죽으면?",
    answerExampleList: [""],
    answer: "다이아몬드",
    questionImagesUrl: [],
    solution: "die + amond 깔깔깔깔",
    questionType: "ESSAY_QUESTION",
  },
  {
    examQuestionId: 43,
    questionText: "파이의 근사값중 가장 가까운것은?",
    answerExampleList: ["3", "3.1", "3.14", "3.141592"],
    answer: "4번",
    questionImagesUrl: [],
    solution: "파이 = 3.1415926507....",
    questionType: "MULTIPLE_CHOICE",
  },
];
