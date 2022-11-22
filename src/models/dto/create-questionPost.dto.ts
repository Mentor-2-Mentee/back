import { QuestionUploadType } from "../types";
import { CreateQuestionDto } from "./create-question.dto";

export class CreateQuestionPostDto {
  uploadType: QuestionUploadType;
  questionForm: CreateQuestionDto;
  guestName?: string;
  guestPassword?: string;
  title: string;
  description: string;
}
