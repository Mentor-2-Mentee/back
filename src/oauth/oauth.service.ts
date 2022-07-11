import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";
import configuration from "../common/config/configuration";
import { User } from "./entities/user.entitiy";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";

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

    const isFirstSignIn = Boolean(registeredUser);

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
