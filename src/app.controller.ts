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
import { OauthService } from "./oauth/oauth.service";
import { JwtAuthGuard } from "./oauth/jwt/jwt-auth.guard";
import configuration from "./common/config/configuration";
import { injectQuerys } from "./common/utils/injectQuerys";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private OauthService: OauthService, //jwt 토근으로 반환하는 login 메서드를 주입후 사용
    private configService: ConfigService
  ) {}

  // @UseGuards(AuthGuard("kakao"))
  // @Get("oauth")
  // @Redirect("AUTH_CALLBACK_URL", 301)
  // async kakaoAuthRedirect(
  //   @Req() req,
  //   @Res({ passthrough: true }) response: Response
  // ) {
  //   console.log("tokenCode:", req.user);

  //   const targetURL = injectQuerys({
  //     targetBaseURL: this.configService.get<string>("AUTH_CALLBACK_URL"),
  //     querys: {
  //       code: req.user,
  //     },
  //   });

  //   return { url: targetURL };
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
