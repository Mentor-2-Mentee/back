import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";
import configuration from "../common/config/configuration";
import { User } from "./entities/user.entitiy";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";

@Injectable()
export class OauthService {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private UserRepository: Repository<User>
  ) {}

  async getUserPayload(params: UserKakaoDto) {
    const registeredUser = await this.UserRepository.findOne({
      userId: params.kakaoId,
    });

    if (!registeredUser) {
      const initialRandomName = `UID-${Math.random()
        .toString()
        .replace("0.", "")}`;

      const result = await this.UserRepository.save({
        userId: params.kakaoId,
        userName: initialRandomName,
      });

      return {
        userId: result.userId,
        username: result.userName,
      };
    }

    return {
      userId: registeredUser.userId,
      username: registeredUser.userName,
    };
  }

  async createToken(params: UserKakaoDto, tokenType: "ACCESS" | "REFRESH") {
    const payload = await this.getUserPayload(params);

    if (tokenType === "REFRESH") {
      return this.jwtService.sign(payload, {
        expiresIn: `${configuration().jwtRefreshExpireTime}`,
      });
    }

    return this.jwtService.sign(payload);
  }

  async sendToken(tokenKeyCode: string) {
    const tokens = await this.cacheManager.get<string>(tokenKeyCode);
    return tokens;
  }
}
