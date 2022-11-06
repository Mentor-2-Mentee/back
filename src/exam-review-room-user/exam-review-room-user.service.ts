import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ExamReviewRoomUser, RawExamQuestion, User } from "src/models";

@Injectable()
export class ExamReviewRoomUserService {
  constructor(
    @InjectModel(ExamReviewRoomUser)
    private examReviewRoomUserModel: typeof ExamReviewRoomUser
  ) {}

  async createNewUser(
    userId: string,
    userGrade: string,
    examReviewRoomId: number,
    isParticipant: boolean
  ) {
    console.log("examReviewRoomId", examReviewRoomId);
    const isExist = Boolean(
      await this.examReviewRoomUserModel.findOne({
        where: { examReviewRoomId, userId },
      })
    );

    if (isExist) return false;

    const newUserInfo = await this.examReviewRoomUserModel.create({
      userId,
      examReviewRoomId,
      userPosition: userGrade,
      isParticipant,
    });

    return Boolean(newUserInfo);
  }

  async findAllExamReviewRoomUser(examReviewRoomId: number) {
    return await this.examReviewRoomUserModel.findAll({
      where: { examReviewRoomId },
      include: [{ model: User }, { model: RawExamQuestion }],
    });
  }

  async updateRoomUserPosition(
    examReviewRoomId: number,
    targetUserId: string,
    newPosition: string
  ) {
    await this.examReviewRoomUserModel.update(
      { userPosition: newPosition },
      {
        where: {
          examReviewRoomId,
          userId: targetUserId,
        },
      }
    );

    return await this.examReviewRoomUserModel.findOne({
      include: { model: User },
      where: {
        examReviewRoomId,
        userId: targetUserId,
      },
    });
  }
}
