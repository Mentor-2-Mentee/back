import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import configuration from "../../common/config/configuration";
import { JwtPayloadDto } from "src/models";
import { UserKakaoDto } from "../../models/dto/user.kakao.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwtSecret,
    });
  }

  //jwt토큰 해싱한 payload를 가져와서 반환한다
  async validate(payload: JwtPayloadDto) {
    return payload;
  }
}
