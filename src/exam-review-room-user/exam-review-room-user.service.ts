import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  DeleteExamReviewRoomUserDto,
  ExamReviewRoom,
  ExamReviewRoomUser,
  RawExamQuestion,
  User,
} from "src/models";

@Injectable()
export class ExamReviewRoomUserService {
  constructor(
    @InjectModel(ExamReviewRoomUser)
    private examReviewRoomUserModel: typeof ExamReviewRoomUser,
    @InjectModel(ExamReviewRoom)
    private examReviewRoomModel: typeof ExamReviewRoom
  ) {}

  async createNewUser(
    userId: string,
    userGrade: string,
    examReviewRoomId: number,
    isParticipant: boolean,
    enterCode?: string
  ) {
    const isExist = Boolean(
      await this.examReviewRoomUserModel.findOne({
        where: { examReviewRoomId, userId },
      })
    );

    if (isExist) return true;

    const targetReviewRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );

    if (userGrade === "master" || userGrade === "admin") {
      const newAdminUser = await this.examReviewRoomUserModel.create({
        userId,
        examReviewRoomId,
        userPosition: userGrade,
        isParticipant,
      });
      return Boolean(newAdminUser);
    }

    if (
      targetReviewRoom.isRestricted &&
      targetReviewRoom.enterCode !== enterCode
    ) {
      console.log("일반유저가 제한방 입장시 입력코드 틀림");
      return false;
    }

    const newUserInfo = await this.examReviewRoomUserModel.create({
      userId,
      examReviewRoomId,
      userPosition: userGrade,
      isParticipant,
    });
    console.log("created new Room user", newUserInfo.id);

    return Boolean(newUserInfo);
  }

  async findAllExamReviewRoomUser(examReviewRoomId: number) {
    return await this.examReviewRoomUserModel.findAll({
      where: { examReviewRoomId },
      include: [{ model: User }, { model: RawExamQuestion }],
    });
  }

  async checkUserEnterable(userId: string, examReviewRoomId: number) {
    const targetRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId,
      {
        include: [{ model: ExamReviewRoomUser }],
      }
    );

    const isExist = Boolean(
      targetRoom.examReviewRoomUsers.findIndex(
        (currentUser) => currentUser.userId === userId
      ) !== -1
    );
    console.log("isExist", isExist);

    return isExist;
  }

  async updateRoomUser(
    userId: string,
    examReviewRoomId: number,
    isParticipant: boolean
  ) {
    const updateCnt = await this.examReviewRoomUserModel.update(
      { isParticipant },
      {
        where: {
          examReviewRoomId,
          userId,
        },
      }
    );

    return Boolean(updateCnt);
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

  async deleteRoomUser({
    examReviewRoomId,
    targetUserId,
  }: DeleteExamReviewRoomUserDto) {
    const targetUser = await this.examReviewRoomUserModel.findOne({
      include: [{ model: User }],
      where: { examReviewRoomId, userId: targetUserId },
    });

    await this.examReviewRoomUserModel.destroy({
      where: { id: targetUser.id },
    });

    return targetUser;
  }
}
