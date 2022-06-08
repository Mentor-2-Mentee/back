import { Injectable } from "@nestjs/common";
import { CreateLiveChatDto } from "./dto/create-live-chat.dto";
import { UpdateLiveChatDto } from "./dto/update-live-chat.dto";
import { LiveChat } from "./entities/live-chat.entity";

@Injectable()
export class LiveChatService {
  private chats: LiveChat[] = [
    {
      uid: "상대방1uid",
      nickName: "상대방1",
      text: "안녕하세요",
      createAt: "2022-03-03T12:34:56",
    },
    {
      uid: "상대방2uid",
      nickName: "상대방2",
      text: "감사해요",
      createAt: "2022-03-03T12:35:56",
    },
    {
      uid: "나의uid",
      nickName: "나",
      text: "이건 내가 친 채팅",
      createAt: "2022-03-03T12:35:59",
    },
    {
      uid: "나의uid",
      nickName: "나",
      text: "이것도 내가 친 채팅",
      createAt: "2022-03-03T12:36:20",
    },
    {
      uid: "상대방2uid",
      nickName: "상대방2",
      text: "잘있어요",
      createAt: "2022-03-03T12:40:20",
    },
    {
      uid: "상대방2uid",
      nickName: "상대방2",
      text: "잘있으라고",
      createAt: "2022-03-03T12:42:20",
    },
    {
      uid: "상대방2uid",
      nickName: "상대방2",
      text: "인사좀해",
      createAt: "2022-03-03T12:40:20",
    },
    {
      uid: "나의uid",
      nickName: "나",
      text: "잘가 ㅂㅂ",
      createAt: "2022-03-03T12:45:20",
    },
    {
      uid: "상대방2uid",
      nickName: "상대방2",
      text: "그랭 ㅎ",
      createAt: "2022-03-03T12:50:20",
    },
  ];

  create(createLiveChatDto: CreateLiveChatDto) {
    return "This action adds a new liveChat";
  }

  findAll() {
    // return `This action returns all chats`;
    console.log("모든 채팅내역 전송");
    return this.chats;
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
