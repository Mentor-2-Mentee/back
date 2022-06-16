import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import configuration from "../config/configuration";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      //실제로는 bcrypt를 이용한 암호화 작업을 수행후 사용해야 한다!
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async createToken(params: any, tokenType: "ACCESS" | "REFRESH") {
    const payload = { username: params.name, userId: params.kakaoId };

    if (tokenType === "REFRESH") {
      return this.jwtService.sign(payload, {
        expiresIn: `${configuration().jwtRefreshExpireTime}`,
      });
    }

    return this.jwtService.sign(payload);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
