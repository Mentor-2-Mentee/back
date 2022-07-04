import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import configuration from "src/config/configuration";
import { UserKakaoDto } from "./dto/user.kakao.dto";
import { Cache } from "cache-manager";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "../auth.service";

interface CachingTokenPayload {
  accessToken: string;
  refreshToken: string;
}

export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(
    readonly configService: ConfigService,
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super({
      clientID: configuration().kakaoRestApiKey,
      callbackURL: configuration().kakaoCallbackURL,
      responseType: configuration().kakaoResponseType,
    });
  }

  async validate(_accessToken, _refreshToken, profile, done) {
    console.log("now_SignIn UserProfile", profile);
    const profileJson = profile._json;
    const kakaoAccount = profileJson.kakao_account;
    const payload: UserKakaoDto = {
      name: kakaoAccount.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakaoAccount.has_email && !kakaoAccount.email_needs_agreement
          ? kakaoAccount.email
          : null,
    };
    const tokenKeyCode = uuidv4();
    const tokenPayload: CachingTokenPayload = {
      accessToken: await this.authService.createToken(payload, "ACCESS"),
      refreshToken: await this.authService.createToken(payload, "REFRESH"),
    };
    await this.cacheManager.set<CachingTokenPayload>(
      tokenKeyCode,
      tokenPayload,
      { ttl: 60 }
    );

    done(null, tokenKeyCode);
  }
}
