import { PartialType } from "@nestjs/mapped-types";
import { CreateLiveChatDto } from "./create-livechat.dto";

export class UpdateLiveChatDto extends PartialType(CreateLiveChatDto) {
  id: number;
}
