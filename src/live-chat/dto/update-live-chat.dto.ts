import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveChatDto } from './create-live-chat.dto';

export class UpdateLiveChatDto extends PartialType(CreateLiveChatDto) {
  id: number;
}
