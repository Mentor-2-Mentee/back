import { CACHE_MANAGER, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import configuration from "../../common/config/configuration";
import { Cache } from "cache-manager";
import { OauthService } from "../oauth.service";
import { GetUserOauthPayloadDto } from "src/models";

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

  get randomUserId(): string {
    return `UID-${Math.random().toString().replace("0.", "").slice(0, 6)}`;
  }

  async validate(_accessToken, _refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakaoAccount = profileJson.kakao_account;
    const kakaoPayload: GetUserOauthPayloadDto = {
      userName: kakaoAccount.profile.nickname || this.randomUserId,
      oauthType: "kakao",
      oauthId: String(profileJson.id),
    };

    const [registeredUser, isNewUser] =
      await this.OauthService.findOrCreateUserByOauth(kakaoPayload);
    const tokenIssueCode = await this.OauthService.createToken(registeredUser);
    // const tokenPayload: CachingTokenPayload =
    //   await this.OauthService.createToken(registeredUser);

    // const tokenPayload: CachingTokenPayload =
    //   await this.OauthService.createToken(payload);
    // await this.cacheManager.set<CachingTokenPayload>(
    //   tokenKeyCode,
    //   tokenPayload,
    //   { ttl: 60 }
    // );

    done(null, tokenIssueCode);
  }
}
