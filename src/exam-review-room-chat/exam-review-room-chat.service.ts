import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import { BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import {
  ExamReviewRoom,
  ExamReviewRoomChat,
  SocketReceiveExamReviewRoomChatDto,
  User,
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
    text,
    userId,
    imageUrlList,
  }: SocketReceiveExamReviewRoomChatDto) {
    const savedChat = await this.examReviewRoomChatModel.create({
      examReviewRoomId,
      authorId: userId,
      text,
      imageUrlList,
    });

    return await this.examReviewRoomChatModel.findByPk(savedChat.id, {
      include: [{ model: User }],
    });
  }

  async findChatList(
    examReviewRoomId: number,
    oldestChatId: number,
    limit: number
  ) {
    const whereOptions: WhereOptions = [];
    whereOptions.push({
      [Op.and]: {
        ["id"]: {
          [Op.lt]: oldestChatId === -1 ? 99999999999 : oldestChatId,
        },
      },
    });
    const { examReviewRoomChats } = await this.examReviewRoomModel.findByPk(
      examReviewRoomId,
      {
        include: [
          {
            model: ExamReviewRoomChat,
            where: {
              [Op.and]: whereOptions,
            },
            include: [{ model: User }],
            order: [["id", "DESC"]],
            limit,
          },
        ],
      }
    );

    return examReviewRoomChats.reverse();
  }
}
