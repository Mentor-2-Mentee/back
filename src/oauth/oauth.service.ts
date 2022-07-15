import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import { User } from "src/models";
import configuration from "../common/config/configuration";
import { UserKakaoDto, UserM2MDto } from "src/models/dto";
import { InjectModel } from "@nestjs/sequelize";

interface UserPayload {
  isFirstSignIn: boolean;
  payload: {
    userId: number;
    username: string;
  };
}

@Injectable()
export class OauthService {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // @InjectRepository(User)
    // private UserRepository: Repository<User>
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async getUserPayload({ kakaoId }: UserKakaoDto): Promise<UserPayload> {
    const registeredUser = await this.userModel.findOne({
      where: {
        userId: kakaoId,
      },
    });

    console.log("로그인한 유저 db정보:", registeredUser);

    if (!registeredUser) {
      const initialRandomName = `UID-${Math.random()
        .toString()
        .replace("0.", "")
        .slice(0, 6)}`;

      const result = await this.userModel.create({
        userId: kakaoId,
        username: initialRandomName,
      });

      return {
        isFirstSignIn: true,
        payload: {
          userId: result.userId,
          username: result.username,
        },
      };
    }

    return {
      isFirstSignIn: false,
      payload: {
        userId: registeredUser.userId,
        username: registeredUser.username,
      },
    };
  }

  async checkUseableName(newName: string) {
    console.log("들어온이름", newName);
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
        username: newName,
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

  async getProfile({
    userId,
    username,
  }: UserM2MDto): Promise<Pick<User, "userId" | "username" | "userGrade">> {
    const targetUser: User = await this.userModel.findOne({
      where: {
        userId: userId,
      },
    });

    return {
      userId: targetUser.userId,
      username: targetUser.username,
      userGrade: targetUser.userGrade,
    };
  }

  async updateProfile(
    { userId, username }: { userId: number; username: string },
    newName: string
  ) {
    await this.userModel.update(
      {
        username: newName,
      },
      {
        where: {
          userId,
        },
      }
    );

    const updateResult = await this.userModel.findOne({
      where: {
        userId,
      },
    });

    return {
      userId: updateResult.userId,
      username: updateResult.username,
    };
  }

  async createToken(params: UserKakaoDto) {
    const { isFirstSignIn, payload } = await this.getUserPayload(params);

    return {
      isFirstSignIn,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: `${configuration().jwtRefreshExpireTime}`,
      }),
    };
  }

  async sendToken(tokenKeyCode: string) {
    const tokens = await this.cacheManager.get<string>(tokenKeyCode);
    return tokens;
  }
}
