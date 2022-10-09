import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";

import { AppliedTagOptions, Question, QuestionPost } from "src/models";
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

  async createQuestionPost(createQuestionPostDto: CreateQuestionPostDto) {
    const newQuestionPost = await this.questionPostModel.create({
      ...createQuestionPostDto,
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
      include: [{ model: Question, where: { [Op.and]: searchTagFilter } }],
      order: [["questionPostId", "DESC"]],
      where: { [Op.and]: searchKeyword },
      offset: (querys.page - 1) * querys.limit,
      limit: querys.limit,
    });

    console.log("result.length", result.length);

    return result;
  }

  async findQuestionPostOneById(postId: number) {
    const result = await this.questionPostModel
      .findByPk(postId, {
        include: [{ model: Question }],
        plain: true,
      })
      .then((data) => {
        data.question.answerExample = JSON.parse(data.question.answerExample);
        data.question.questionImageUrl = JSON.parse(
          data.question.questionImageUrl
        );
        data.question.detailTag = JSON.parse(data.question.detailTag);
        data.viewCount = data.viewCount + 1;
        return data;
      });

    await this.questionPostModel.update(
      {
        viewCount: result.viewCount,
      },
      { where: { questionPostId: postId } }
    );

    return result;
  }

  async getQuestionPostMaxPage(limit = 10) {
    const totalPostLength = await this.questionPostModel.count();

    return Math.floor(totalPostLength / limit) + 1;
  }
}
