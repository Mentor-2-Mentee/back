import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Req,
  Redirect,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OauthService } from "./oauth.service";
import { injectURLQuerys } from "src/common/utils/injectURLQuerys";
import { ConfigService } from "@nestjs/config";
import { AuthorizeUserProfile, CreateOauthCodeDto } from "src/models";

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

  @Post("/token")
  async sendToken(@Body() bodyParam: CreateOauthCodeDto) {
    const { accessToken, refreshToken } = await this.OauthService.sendToken(
      bodyParam.authCode
    );

    return {
      message: "OK",
      accessToken,
      refreshToken,
    };
  }
}
