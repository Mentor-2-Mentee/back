import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ExamReviewRoomUser, RawExamQuestion } from "src/models";

@Injectable()
export class RawExamQuestionService {
  constructor(
    @InjectModel(RawExamQuestion)
    private rawExamQuestionModel: typeof RawExamQuestion,
    @InjectModel(ExamReviewRoomUser)
    private examReviewRoomUserModel: typeof ExamReviewRoomUser
  ) {}

  async saveRawExamQuestion(
    userId: string,
    examQuestionId: number,
    questionText: string,
    solution?: string
  ) {
    const examReviewRoomUser = await this.examReviewRoomUserModel.findOne({
      where: { userId },
    });

    const savedRawExamQuestion = await this.rawExamQuestionModel.create({
      authorId: userId,
      examQuestionId,
      questionText,
      solution,
      examReviewRoomUserId: examReviewRoomUser.id,
    });

    return Boolean(savedRawExamQuestion);
  }
}
