import { QuestionTag } from "../entities";

// interface FilterOption {
//   rootFilterTag?: string;
//   childFilterTags: FilterTag[];
//   filterKeywords: string[];
// }

// interface FilterTag {
//   parentFilterTag?: string;
//   tagName: string;
// }

export class AppliedTagOptionsDto {
  rootFilterTag?: string;
  childFilterTags: QuestionTag[];
  filterKeywords: string[];
}
