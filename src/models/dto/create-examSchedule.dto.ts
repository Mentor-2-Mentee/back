export class CreateExamScheduleDto {
  organizer: string;
  examUrl: string;
  examDate: string;
  scheduleType: string;
  description: string;
  imageUrl: string[];
  examStartTime?: string;
  examEndTime?: string;
}
