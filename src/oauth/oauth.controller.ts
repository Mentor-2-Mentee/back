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
import { AuthUserRequestDto, PostOauthCodeDto } from "src/models";

@Controller("oauth")
export class OauthController {
  constructor(
    private readonly OauthService: OauthService,
    private configService: ConfigService
  ) {}

  @UseGuards(AuthGuard("kakao"))
  @Get("/kakao")
  async kakaoLogin(@Req() req): Promise<any> {
    return HttpStatus.OK;
  }

  @UseGuards(AuthGuard("kakao"))
  @Get()
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(@Req() req: AuthUserRequestDto) {
    const targetURL = injectURLQuerys({
      targetBaseURL: this.configService.get<string>("AUTH_CALLBACK_URL"),
      querys: {
        code: req.user,
      },
    });

    return { url: targetURL };
  }

  @Post("/token")
  async sendToken(@Body() bodyParam: PostOauthCodeDto) {
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
