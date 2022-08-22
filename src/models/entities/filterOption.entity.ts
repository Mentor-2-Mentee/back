import { QuestionTag } from "./questionTag.entity";

export class FilterOption {
  rootFilterTag?: string;
  childFilterTags: QuestionTag[];
  filterKeywords: string[];
}
