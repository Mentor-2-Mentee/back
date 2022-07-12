import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Req,
  Request,
  Redirect,
  Put,
  Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OauthService } from "./oauth.service";
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
  async getProfile(@Request() req) {
    console.log("GET /profile", req.user);
    return await this.OauthService.getProfile(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(@Request() req, @Body() body) {
    console.log("POST /profile", req.user, body);
    return await this.OauthService.updateProfile(req.user, body.newName);
  }

  @Get("name_check?")
  async getCheckResult(@Request() req, @Query("newname") newName) {
    return this.OauthService.checkUseableName(newName);
  }

  @UseGuards(AuthGuard("kakao"))
  @Get()
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(@Req() req) {
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
