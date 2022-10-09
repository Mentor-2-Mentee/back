import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UpdateUserProfileDto, User } from "src/models";

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
      console.log("공백발견");

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
