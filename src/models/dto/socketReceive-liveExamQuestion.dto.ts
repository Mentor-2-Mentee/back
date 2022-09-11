import { QuestionType } from "../types";
import { UpdateExamQuestionDto } from "./update-examQuestion.dto";

export class SocketReceiveLiveExamQuestionDto {
  userId: number;
  examScheduleId: string;
  examField: string;
  nowQuestionIndex: number;
  updateExamQuestionData: UpdateExamQuestionDto;
}
