interface FilterOptionElement {
  filterKey: string;
  describeText: string;
  parentElement?: {
    parentDescribeText: string;
    parentFilterKey: string;
  };
}
interface AppliedOptions {
  parentElement?: Omit<FilterOptionElement, "parentElement">;
  childElements: Omit<FilterOptionElement, "parentElement">[];
  filterKeywords: string[];
}

export class CreateLiveRoomDto {
  roomTitle: string;
  appliedTagOptions: string; //Omit<AppliedOptions, "filterKeywords">;
  explainRoomText?: string;
}
