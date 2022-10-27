export class CreateExamQuestionCommentDto {
  examQuestionId: number;
  comment: string;
  commentLevel?: number;
  parentCommentId?: number;
}
