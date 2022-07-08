export class CreateLiveRoomDto {
  roomTitle: string;
  appliedTagOptions: string; //Omit<AppliedOptions, "filterKeywords">;
  explainRoomText?: string;
}
