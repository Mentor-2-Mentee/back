import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import configuration from "../../common/config/configuration";
import { UserKakaoDto } from "../../models/dto/user.kakao.dto";
import { Cache } from "cache-manager";
import { v4 as uuidv4 } from "uuid";
import { OauthService } from "../oauth.service";

interface CachingTokenPayload {
  accessToken: string;
  refreshToken: string;
}

export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(
    readonly configService: ConfigService,
    private OauthService: OauthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super({
      clientID: configuration().kakaoRestApiKey,
      callbackURL: configuration().kakaoCallbackURL,
      responseType: configuration().kakaoResponseType,
    });
  }

  async validate(_accessToken, _refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakaoAccount = profileJson.kakao_account;
    const payload: UserKakaoDto = {
      name:
        kakaoAccount.profile.nickname ||
        `UID-${Math.random().toString().replace("0.", "").slice(0, 6)}`, //undiefined일수있음
      kakaoId: profileJson.id,
      email:
        kakaoAccount.has_email && !kakaoAccount.email_needs_agreement
          ? kakaoAccount.email
          : null,
    };
    console.log(payload);
    const tokenKeyCode = uuidv4();

    const tokenPayload: CachingTokenPayload =
      await this.OauthService.createToken(payload);
    await this.cacheManager.set<CachingTokenPayload>(
      tokenKeyCode,
      tokenPayload,
      { ttl: 60 }
    );

    done(null, tokenKeyCode);
  }
}
