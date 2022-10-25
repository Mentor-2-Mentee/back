export class CreatePostCommentDto {
  postId: number;
  comment: string;
  commentLevel?: number;
  parentCommentId?: number;
}
