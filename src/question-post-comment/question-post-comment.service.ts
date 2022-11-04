import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { QuestionPost, User } from "src/models";
import { QuestionPostComment } from "src/models/entities/questionPostComment.entity";

@Injectable()
export class QuestionPostCommentService {
  constructor(
    @InjectModel(QuestionPostComment)
    private postCommentModel: typeof QuestionPostComment,
    @InjectModel(QuestionPost)
    private questionPostModel: typeof QuestionPost,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async findCommentListByPostId(questionPostId: number) {
    const commentList = await this.postCommentModel.findAll({
      where: { questionPostId },
      order: [
        ["parentCommentId", "ASC"],
        ["id", "ASC"],
      ],
    });

    return commentList;
  }

  async createComment(
    userId: string,
    questionPostId: number,
    comment: string,
    commentLevel = 0,
    parentCommentId?: number
  ) {
    const user = await this.userModel.findByPk(userId);
    const savedComment = await this.postCommentModel.create({
      questionPostId,
      commentLevel,
      parentCommentId,
      comment,
      author: user.userName,
      authorId: user.id,
    });
    return Boolean(savedComment);
  }

  async deleteComment(userId: string, commentId: number) {
    const targetComment = await this.postCommentModel.findByPk(commentId);
    if (targetComment.authorId !== userId) return false;

    const deleteCnt = await this.postCommentModel.destroy({
      where: { id: commentId },
    });
    return Boolean(deleteCnt);
  }
}
