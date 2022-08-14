import { QuestionTag } from "../entities";

export class AppliedTagOptionsDto {
  rootFilterTag?: string;
  childFilterTags: QuestionTag[];
  filterKeywords: string[];
}
