import { QuestionTag } from "../entities";

export class CreateQuestionDto {
  rootTag: string;
  detailTag: string[];
  questionType: string;
  questionText: string;
  answerExample: string[];
  questionImageUrl?: string[];
  solution?: string;
  answer?: string;
}
