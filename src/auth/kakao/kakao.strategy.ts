import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import configuration from "src/config/configuration";
import { UserKakaoDto } from "./dto/user.kakao.dto";

export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configuration().kakaoRestApiKey,
      callbackURL: configuration().kakaoCallbackURL,
      responseType: configuration().kakaoResponseType,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
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

    done(null, payload);
  }
}
