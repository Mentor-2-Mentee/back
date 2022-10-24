import { QuestionUploadType } from "../types";
import { CreateQuestionDto } from "./create-question.dto";

export class CreateQuestionPostDto {
  uploadType: QuestionUploadType;
  questionForm: CreateQuestionDto;
  title: string;
  description: string;
}
