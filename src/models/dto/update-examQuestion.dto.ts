import { QuestionType } from "../types";

export class UpdateExamQuestionDto {
  id: number;
  questionText: string;
  answerExampleList: string[];
  answer: string;
  questionImagesUrl: string[];
  solution: string;
  questionType: QuestionType;
}
