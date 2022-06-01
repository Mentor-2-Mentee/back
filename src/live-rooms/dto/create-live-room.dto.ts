export class CreateLiveRoomDto {
  roomId: string;
  title: string;
  author: string;
  authorColor: string;
  createdAt: string;
  startedAt: string;
  thumbnailImgURL: string;
  roomTags?: string[];
}
