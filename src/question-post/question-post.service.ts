import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Model, Op, WhereOptions } from "sequelize";

import {
  AppliedTagOptions,
  Question,
  QuestionPost,
  UpdateQuestionPostDto,
  User,
} from "src/models";
import { CreateQuestionPostDto } from "src/models/dto/create-questionPost.dto";
import { QuestionService } from "src/question/question.service";

@Injectable()
export class QuestionPostService {
  constructor(
    @InjectModel(QuestionPost)
    private questionPostModel: typeof QuestionPost,
    @InjectModel(Question)
    private questionModel: typeof Question
  ) {}

  async createQuestionPost(
    userId: string,
    questionId: number,
    title: string,
    description: string
  ) {
    const newQuestionPost = await this.questionPostModel.create({
      questionId,
      authorId: userId,
      title,
      description,
    });

    return newQuestionPost;
  }

  async findQuestionPostList(querys: {
    page: number;
    limit: number;
    filter: AppliedTagOptions;
  }) {
    const searchTagFilter: WhereOptions = [];
    const searchKeyword: WhereOptions = [];

    if (querys.filter.rootFilterTag) {
      searchTagFilter.push({
        [Op.and]: {
          ["rootTag"]: querys.filter.rootFilterTag,
        },
      });
    }

    if (querys.filter.childFilterTags.length !== 0) {
      querys.filter.childFilterTags.map((childTag) => {
        searchTagFilter.push({
          [Op.and]: {
            ["detailTag"]: childTag.tagName,
          },
        });
      });
    }

    if (querys.filter.filterKeywords.length !== 0) {
      querys.filter.filterKeywords.map((keyword) => {
        searchKeyword.push({
          [Op.and]: {
            ["questionPostTitle"]: {
              [Op.like]: `%${keyword}%`,
            },
          },
        });
      });
    }

    const result = await this.questionPostModel.findAll({
      include: [
        { model: Question, where: { [Op.and]: searchTagFilter } },
        { model: User },
      ],
      order: [["id", "DESC"]],
      where: { [Op.and]: searchKeyword },
      offset: (querys.page - 1) * querys.limit,
      limit: querys.limit,
    });
    return result;
  }

  async findQuestionPostOneById(postId: number) {
    const targetPost = await this.questionPostModel.findByPk(postId, {
      include: [{ model: Question }, { model: User }],
    });
    const author = await targetPost.$get("author");
    const question = await targetPost.$get("question");

    await this.questionPostModel.update(
      {
        viewCount: targetPost.viewCount + 1,
      },
      { where: { id: postId } }
    );

    return {
      id: targetPost.id,
      createdAt: targetPost.createdAt,
      updatedAt: targetPost.updatedAt,
      question,
      author,
      title: targetPost.title,
      description: targetPost.description,
      viewCount: targetPost.viewCount,
    };
  }

  async getQuestionPostMaxPage(limit = 10) {
    const totalPostLength = await this.questionPostModel.count();

    return Math.floor(totalPostLength / limit) + 1;
  }

  async updatePost(
    userId: string,
    { id, title, description }: UpdateQuestionPostDto
  ): Promise<boolean> {
    const targetPost = await this.questionPostModel.findByPk(id, {
      include: { model: User, where: { id: userId } },
    });

    if (!targetPost) return false;

    const updateCnt = await this.questionPostModel.update(
      {
        title,
        description,
      },
      {
        where: { id },
      }
    );

    return Boolean(updateCnt);
  }

  async deletePost(userId: string, postId: number) {
    const targetPost = await this.questionPostModel.findByPk(postId, {
      include: { model: User, where: { id: userId } },
    });
    if (!targetPost) return false;

    const deleteCnt = await this.questionPostModel.destroy({
      where: { id: postId },
    });

    return Boolean(deleteCnt);
  }
}
