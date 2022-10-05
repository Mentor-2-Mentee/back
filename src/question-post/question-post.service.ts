import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Order, WhereOptions } from "sequelize";

import { Question, QuestionPost } from "src/models";
import { CreateQuestionPostDto } from "src/models/dto/create-questionPost.dto";
import { QuestionService } from "src/question/question.service";

@Injectable()
export class QuestionPostService {
  constructor(
    @InjectModel(QuestionPost)
    private questionPostModel: typeof QuestionPost
  ) {}

  async createQuestionPost(createQuestionPostDto: CreateQuestionPostDto) {
    const newQuestionPost = await this.questionPostModel.create({
      ...createQuestionPostDto,
    });

    return newQuestionPost;
  }

  async findQuestionPost() {
    const searchFilterQuerys: WhereOptions = [];
    const result = await this.questionPostModel.findAll({
      include: [Question],
      order: [["questionPostId", "DESC"]],
    });

    return result;
  }

  async getQuestionPostMaxPage(limit = 10) {
    const totalPostLength = await this.questionPostModel.count();

    return Math.floor(totalPostLength / limit) + 1;
  }
}
