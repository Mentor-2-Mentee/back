import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ExamQuestion, ExamQuestionComment, User } from "src/models";

@Injectable()
export class ExamQuestionCommentService {
  constructor(
    @InjectModel(ExamQuestionComment)
    private examQuestionCommentModel: typeof ExamQuestionComment,
    @InjectModel(ExamQuestion)
    private examQuestioModel: typeof ExamQuestion,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async findCommentListByExamQuestionId(examQuestionId: number) {
    const commentList = await this.examQuestionCommentModel.findAll({
      where: { examQuestionId },
      order: [
        ["parentCommentId", "ASC"],
        ["id", "ASC"],
      ],
    });
    return commentList;
  }

  async createComment(
    userId: string,
    examQuestionId: number,
    comment: string,
    commentLevel = 0,
    parentCommentId?: number
  ) {
    const user = await this.userModel.findByPk(userId);
    const savedComment = await this.examQuestionCommentModel.create({
      examQuestionId,
      commentLevel,
      parentCommentId,
      comment,
      author: user.userName,
      authorId: user.id,
    });

    return Boolean(savedComment);
  }

  async deleteComment(userId: string, commentId: number) {
    const targetComment = await this.examQuestionCommentModel.findByPk(
      commentId
    );
    if (targetComment.authorId !== userId) return false;

    const deleteCnt = await this.examQuestionCommentModel.destroy({
      where: { id: commentId },
    });

    return Boolean(deleteCnt);
  }
}
