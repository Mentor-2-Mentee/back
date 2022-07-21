import { QuestionTag } from "./questionTag.entitiy";

export class FilterOption {
  rootFilterTag?: string;
  childFilterTags: QuestionTag[];
  filterKeywords: string[];
}
