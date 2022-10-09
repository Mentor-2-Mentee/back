import { QuestionTag } from "../entities";

export class AppliedTagOptions {
  rootFilterTag?: string;
  childFilterTags: QuestionTag[];
  filterKeywords: string[];
}
