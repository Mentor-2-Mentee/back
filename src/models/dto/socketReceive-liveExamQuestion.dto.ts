import { QuestionType } from "../types";
import { UpdateExamQuestionDto } from "./update-examQuestion.dto";

export class SocketReceiveLiveExamQuestionDto {
  userId: number;
  examScheduleId: string;
  examType: string;
  nowQuestionIndex: number;
  updateExamQuestionData: UpdateExamQuestionDto;
}
