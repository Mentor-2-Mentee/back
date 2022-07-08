interface FilterOptionElement {
  filterKey: string;
  describeText: string;
  parentElement?: {
    parentDescribeText: string;
    parentFilterKey: string;
  };
}

export class AppliedTagOptionsDto {
  parentElement?: Omit<FilterOptionElement, "parentElement">;
  childElements: Omit<FilterOptionElement, "parentElement">[];
  filterKeywords: string[];
}