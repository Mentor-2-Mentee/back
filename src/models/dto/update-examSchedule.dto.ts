export class UpdateExamScheduleDto {
  id: number;
  organizer: string;
  examUrl: string;
  examDate: string;
  scheduleType: string;
  description: string;
  imageUrl: string[];
  examStartTime?: string | null;
  examEndTime?: string | null;
}
