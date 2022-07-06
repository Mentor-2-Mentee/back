import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import configuration from "../common/config/configuration";

@Injectable()
export class OauthService {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async createToken(params: any, tokenType: "ACCESS" | "REFRESH") {
    const payload = { username: params.name, userId: params.kakaoId };

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

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
