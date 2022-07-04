import {
  Controller,
  Get,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt/jwt-auth.guard";
import { LocalAuthGuard } from "./auth/local/local-auth.guard"; // 로컬 인증과정을 바로 노출하면 좋지않으므로 한번 감싸준다
import configuration from "./config/configuration";
import { injectQuerys } from "./utils/injectQuerys";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService, //jwt 토근으로 반환하는 login 메서드를 주입후 사용
    private configService: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("kakao"))
  @Get("oauth")
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log("tokenCode:", req.user);

    const targetURL = injectQuerys({
      targetBaseURL: this.configService.get<string>("AUTH_CALLBACK_URL"),
      querys: {
        code: req.user,
      },
    });

    return { url: targetURL };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
