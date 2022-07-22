import { Injectable } from "@nestjs/common";
import { CreateLiveChatDto, UpdateLiveChatDto } from "src/models";
import { LiveChat } from "../models/entities/livechat.entity";

@Injectable()
export class LiveChatService {
  create(createLiveChatDto: CreateLiveChatDto) {
    return "This action adds a new liveChat";
  }

  findAll() {
    console.log("모든 채팅내역 전송");
    return "asd";
  }

  findOne(id: number) {
    return `This action returns a #${id} liveChat`;
  }

  update(id: number, updateLiveChatDto: UpdateLiveChatDto) {
    return `This action updates a #${id} liveChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} liveChat`;
  }
}
