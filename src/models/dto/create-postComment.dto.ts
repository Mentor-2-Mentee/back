export class CreatePostCommentDto {
  questionPostId: number;
  comment: string;
  commentLevel?: number;
  parentCommentId?: number;
}
