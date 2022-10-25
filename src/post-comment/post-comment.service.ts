import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { QuestionPost, User } from "src/models";
import { PostComment } from "src/models/entities/postComment.entity";

@Injectable()
export class PostCommentService {
  constructor(
    @InjectModel(PostComment)
    private postCommentModel: typeof PostComment,
    @InjectModel(QuestionPost)
    private questionPostModel: typeof QuestionPost,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async findCommentListByPostId(postId: number) {
    const commentList = await this.postCommentModel.findAll({
      where: { postId },
      order: [
        ["parentCommentId", "ASC"],
        ["id", "ASC"],
      ],
    });

    return commentList;
  }

  async createComment(
    userId: string,
    postId: number,
    comment: string,
    commentLevel = 0,
    parentCommentId?: number
  ) {
    const user = await this.userModel.findByPk(userId);
    const savedComment = await this.postCommentModel.create({
      postId,
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
