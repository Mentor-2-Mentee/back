import {
  Controller,
  Get,
  Header,
  Post,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local/local-auth.guard"; // 로컬 인증과정을 바로 노출하면 좋지않으므로 한번 감싸준다

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService //jwt 토근으로 반환하는 login 메서드를 주입후 사용
  ) {}

  // @UseGuards(AuthGuard("local")) //local이라는 default명으로 local strategy를 사용했음. => 이름을 바꿔서 사용하면 각 passport별 전략을 명확히 구분하여 사용가능
  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @Get("auth/kakao")
  @UseGuards(AuthGuard("kakao"))
  async kakaoAuth(@Req() req) {}

  @Get("oauth")
  @Redirect("http://localhost:3801", 301)
  findAll(@Res({ passthrough: true }) response: Response) {
    response.cookie("testkey", "testvalue");
  }

  // @UseGuards(AuthGuard("kakao"))
  // kakaoAuthRedirect(@Req() req) {
  //   return this.authService.getKakaoAccessToken(req);
  // }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
