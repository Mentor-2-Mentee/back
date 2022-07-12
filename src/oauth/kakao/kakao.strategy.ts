import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { v4 as uuidv4 } from "uuid";
import { Cache } from "cache-manager";

import configuration from "src/common/config/configuration";
import { OauthService } from "../oauth.service";
import { CacheTokenPayload, UserKakaoDto } from "src/models/dto";

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
      name: kakaoAccount.profile.nickname,
      kakaoId: profileJson.id,
      email:
        kakaoAccount.has_email && !kakaoAccount.email_needs_agreement
          ? kakaoAccount.email
          : null,
    };
    console.log(payload);
    const tokenKeyCode = uuidv4();

    const tokenPayload: CacheTokenPayload = await this.OauthService.createToken(
      payload
    );
    await this.cacheManager.set<CacheTokenPayload>(tokenKeyCode, tokenPayload, {
      ttl: 60,
    });

    done(null, tokenKeyCode);
  }
}
