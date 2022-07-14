import { FilterTag } from "./filterTag.entity";

export class FilterOption {
  rootFilterTag?: string;
  childFilterTags: FilterTag[];
  filterKeywords: string[];
}
