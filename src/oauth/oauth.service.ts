import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";
import configuration from "../common/config/configuration";
import { User } from "./entities/user.entitiy";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";
import { UserM2MDto } from "./kakao/dto/user.m2m.dto";

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
    @InjectRepository(User)
    private UserRepository: Repository<User>
  ) {}

  async getUserPayload(params: UserKakaoDto): Promise<UserPayload> {
    const registeredUser = await this.UserRepository.findOne({
      userId: params.kakaoId,
    });

    console.log("로그인한 유저 db정보:", registeredUser);

    if (!registeredUser) {
      const initialRandomName = `UID-${Math.random()
        .toString()
        .replace("0.", "")
        .slice(0, 6)}`;

      const result = await this.UserRepository.save({
        userId: params.kakaoId,
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

    const result = await this.UserRepository.findOne({
      username: newName,
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

  async getProfile(payload: { userId: number; username: string }) {
    const targetUser: User = await this.UserRepository.findOne({
      userId: payload.userId,
    });

    return {
      userId: targetUser.userId,
      username: targetUser.username,
    };
  }

  async updateProfile(
    payload: { userId: number; username: string },
    newName: string
  ) {
    const targetUser: User = await this.UserRepository.findOne({
      userId: payload.userId,
    });
    const newUser: User = {
      ...targetUser,
      username: newName,
    };
    const result = await this.UserRepository.save(newUser);

    return {
      userId: result.userId,
      username: result.username,
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
