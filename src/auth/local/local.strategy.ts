import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); // 여기서 custom passport를 불러서 해당 custom passport별 전략을 주입한다.
  }

  async validate(username: string, password: string): Promise<any> {
    // 검증전략을 따로 만들었음
    console.log("로컬 스트레티지");

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
