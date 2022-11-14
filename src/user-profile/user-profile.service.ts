import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  ExamReviewRoom,
  ExamReviewRoomUser,
  ExamSchedule,
  QuestionPost,
  QuestionPostComment,
  UpdateUserProfileDto,
  User,
} from "src/models";

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async findUserProfileById(userId: string) {
    const { id, userName, userGrade } = await this.userModel.findByPk(userId);
    return {
      id,
      userName,
      userGrade,
    };
  }

  async findUserPostList(userId: string) {
    const targetUser = await this.userModel.findByPk(userId, {
      include: {
        model: QuestionPost,
        attributes: ["id", "title"],
        include: [{ model: QuestionPostComment }],
      },
    });
    return targetUser.questionPosts;
  }

  async findAllUserExamReviewRoom(userId: string) {
    const targetUser = await this.userModel.findByPk(userId, {
      include: {
        model: ExamReviewRoomUser,
        include: [
          {
            model: ExamReviewRoom,
            attributes: ["id", "examType"],
            include: [{ model: ExamSchedule, attributes: ["organizer"] }],
          },
        ],
      },
    });

    const examReviewRoomList = targetUser.myReviewRoomRelations.map(
      (reviewRoomRelation) => {
        return {
          id: reviewRoomRelation.examReviewRoom.id,
          examType: reviewRoomRelation.examReviewRoom.examType,
          organizer: reviewRoomRelation.examReviewRoom.examSchedule.organizer,
        };
      }
    );

    return examReviewRoomList;
  }

  async updateUserProfile(userId: string, { newName }: UpdateUserProfileDto) {
    await this.userModel.update(
      {
        userName: newName,
      },
      { where: { id: userId } }
    );
    return await this.findUserProfileById(userId);
  }

  async checkUseableName(newName: string) {
    if (newName.length < 1) {
      return {
        message: "새 닉네임을 입력해주세요.",
        canUse: false,
      };
    }
    if (newName.match(/\s/g)) {
      return {
        message: "공백문자는 사용할 수 없습니다.",
        canUse: false,
      };
    }

    const result = await this.userModel.findOne({
      where: {
        userName: newName,
      },
    });

    if (Boolean(result)) {
      return {
        message: "이미 사용중인 닉네임입니다.",
        canUse: false,
      };
    }

    return {
      message: `OK`,
      canUse: true,
    };
  }
}
