import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import {
  ExamReviewRoom,
  ExamReviewRoomChat,
  SocketReceiveExamReviewRoomChatDto,
} from "src/models";

@Injectable()
export class ExamReviewRoomChatService {
  constructor(
    @InjectModel(ExamReviewRoomChat)
    private examReviewRoomChatModel: typeof ExamReviewRoomChat,
    @InjectModel(ExamReviewRoom)
    private examReviewRoomModel: typeof ExamReviewRoom
  ) {}

  async saveChat({
    examReviewRoomId,
    authorId,
    chat,
  }: SocketReceiveExamReviewRoomChatDto) {
    const savedChat = await this.examReviewRoomChatModel.create({
      examReviewRoomId,
      authorId,
      chat,
    });

    return savedChat;
  }

  async findChatList(examReviewRoomId: number) {
    const { examReviewRoomChats } = await this.examReviewRoomModel.findByPk(
      examReviewRoomId,
      { include: [{ model: ExamReviewRoomChat }] }
    );

    return examReviewRoomChats;
  }
}
