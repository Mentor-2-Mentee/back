export class CreateInqueryDto {
  title: string;
  description: string;
  instantName?: string;
  instantPassword?: string;
  isPrivate: boolean;
  targetInqueryId?: number;
}
