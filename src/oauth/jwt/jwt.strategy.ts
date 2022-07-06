import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import configuration from "../../common/config/configuration";
import { UserKakaoDto } from "../kakao/dto/user.kakao.dto";
import { JwtPayloadDto } from "./dto/user.payload.dto";

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
    return {
      userId: payload.userId,
      username: payload.username,
    };
  }
}
