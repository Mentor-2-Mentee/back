import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  HttpStatus,
  Req,
  Inject,
  CACHE_MANAGER,
  Res,
  Request,
  Redirect,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OauthService } from "./oauth.service";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";
import { Cache } from "cache-manager";
import { MessagePattern } from "@nestjs/microservices";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { injectQuerys } from "src/common/utils/injectQuerys";
import { ConfigService } from "@nestjs/config";

@Controller("oauth")
export class OauthController {
  constructor(
    private readonly OauthService: OauthService,
    private configService: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    console.log(req.user);
    return req.user;
  }

  @UseGuards(AuthGuard("kakao"))
  @Get()
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(
    @Req() req
    // @Res({ passthrough: true }) response: Response
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

  @Post("/token")
  sendToken(@Body() bodyParam: any) {
    const tokens = this.OauthService.sendToken(bodyParam.code);
    return tokens;
  }
  @UseGuards(AuthGuard("kakao"))
  @Get("/kakao")
  async kakaoLogin(@Req() req): Promise<any> {
    return HttpStatus.OK;
  }

  @Get("redirect")
  @UseGuards(AuthGuard("kakao"))
  async kakaoLoginCallBack(@Req() req) {
    console.log("redirect.req", req);
  }
}
