import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ExamQuestion, RawExamQuestion } from "src/models";

@Injectable()
export class RawExamQuestionService {
  constructor(
    @InjectModel(RawExamQuestion)
    private rawExamQuestionModel: typeof RawExamQuestion,
    @InjectModel(ExamQuestion)
    private examQuestionModel: typeof ExamQuestion
  ) {}

  async saveRawExamQuestion(
    userId: string,
    examQuestionId: number,
    questionText: string,
    solution?: string
  ) {
    const savedRawExamQuestion = await this.rawExamQuestionModel.create({
      authorId: userId,
      examQuestionId,
      questionText,
      solution,
    });

    const examQuestion = await this.examQuestionModel.findByPk(examQuestionId);
    await this.examQuestionModel.update(
      {
        rawExamQuestionId: [
          ...examQuestion.rawExamQuestionId,
          savedRawExamQuestion.id,
        ],
      },
      {
        where: { id: examQuestionId },
      }
    );

    return Boolean(savedRawExamQuestion);
  }
}
