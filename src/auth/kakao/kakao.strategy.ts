import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import configuration from "src/config/configuration";
import { UserKakaoDto } from "./dto/user.kakao.dto";
import { Cache } from "cache-manager";

export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(
    readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super({
      clientID: configuration().kakaoRestApiKey,
      callbackURL: configuration().kakaoCallbackURL,
      responseType: configuration().kakaoResponseType,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    console.log(profile);
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
    await this.cacheManager.set<number>("authCahe", 123123123, { ttl: 60 });

    done(null, payload);
  }
}
