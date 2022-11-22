export class CreateInqueryDto {
  title: string;
  description: string;
  guestName?: string;
  guestPassword?: string;
  isPrivate: boolean;
  targetInqueryId?: number;
}
