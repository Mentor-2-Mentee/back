import { QuestionTag } from "../entities";

export class CreateQuestionDto {
  rootTag: string;
  detailTag: string[];
  questionText: string;
  solution?: string;
}
