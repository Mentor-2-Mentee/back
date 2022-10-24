import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Req,
  Redirect,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OauthService } from "./oauth.service";
import { injectURLQuerys } from "src/common/utils/injectURLQuerys";
import { ConfigService } from "@nestjs/config";
import { AuthorizeUserProfile, CreateOauthCodeDto } from "src/models";
import { Response } from "express";

@Controller("oauth")
export class OauthController {
  constructor(
    private readonly OauthService: OauthService,
    private configService: ConfigService
  ) {}

  @UseGuards(AuthGuard("kakao"))
  @Get("/kakao")
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @UseGuards(AuthGuard("kakao"))
  @Get()
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(@Req() { user }: AuthorizeUserProfile) {
    const targetURL = injectURLQuerys({
      targetBaseURL: this.configService.get<string>("AUTH_CALLBACK_URL"),
      querys: {
        code: user,
      },
    });

    return { url: targetURL };
  }

  @Post("/test-token")
  async testTokenInject(@Res() res: Response) {
    res.setHeader("Authorization", `Bearer babababababaa`);
    res.cookie("test", "babababababaa", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.send({
      message: "OK",
    });
  }

  @Post("/token")
  async sendToken(@Body() bodyParam: CreateOauthCodeDto) {
    const { accessToken, refreshToken } = await this.OauthService.sendToken(
      bodyParam.authCode
    );

    // 추후 httpOnly로 교체 필요
    // res.setHeader("Authorization", `Bearer ${accessToken}`);
    // res.cookie("test", accessToken, {
    //   httpOnly: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    // return res.send({
    //   message: "OK",
    //   // accessToken,
    //   // refreshToken,
    // });

    return {
      message: "OK",
      accessToken,
      refreshToken,
    };
  }
}
