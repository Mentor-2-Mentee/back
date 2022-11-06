import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ExamReviewRoomUser, User } from "src/models";

@Injectable()
export class ExamReviewRoomUserService {
  constructor(
    @InjectModel(ExamReviewRoomUser)
    private examReviewRoomUserModel: typeof ExamReviewRoomUser
  ) {}

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
