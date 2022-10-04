import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateQuestionDto, Question } from "src/models";
import { WhereOptions, Op, Order } from "sequelize";

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question
  ) {}

  async createNewQuestionByText(createQuestionDto: CreateQuestionDto) {
    if (!createQuestionDto.questionText) return;

    const newQuestion = await this.questionModel.create({
      ...createQuestionDto,
    });
    return newQuestion;
  }

  async createNewQuestionByImage(createQuestionDto: CreateQuestionDto) {
    if (
      !createQuestionDto.questionImageUrl ||
      createQuestionDto.questionImageUrl.length === 0
    )
      return;
    const newQuestion = await this.questionModel.create({
      ...createQuestionDto,
    });
    return newQuestion;
  }
}
