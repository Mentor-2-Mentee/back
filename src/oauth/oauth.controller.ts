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
import { injectURLQuerys } from "src/common/utils/injectURLQuerys";
import { ConfigService } from "@nestjs/config";
import { AuthUserRequestDto } from "src/models";

@Controller("oauth")
export class OauthController {
  constructor(
    private readonly OauthService: OauthService,
    private configService: ConfigService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfileByUserId(@Req() request: AuthUserRequestDto) {
    return await this.OauthService.getProfile(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put("profile")
  async updateProfile(@Request() req, @Body() body) {
    console.log("POST /profile", req.user, body);
    return await this.OauthService.updateProfile(req.user, body.newName);
  }

  @Get("name_check")
  async getCheckResult(@Query("newname") newName: string) {
    return this.OauthService.checkUseableName(newName);
  }

  @UseGuards(AuthGuard("kakao"))
  @Get()
  @Redirect("AUTH_CALLBACK_URL", 301)
  async kakaoAuthRedirect(@Req() req) {
    console.log("tokenCode:", req.user);

    const targetURL = injectURLQuerys({
      targetBaseURL: this.configService.get<string>("AUTH_CALLBACK_URL"),
      querys: {
        code: req.user,
      },
    });

    return { url: targetURL };
  }

  @Post("/token")
  async sendToken(@Body() bodyParam: any) {
    const tokens = await this.OauthService.sendToken(bodyParam.code);
    console.log(bodyParam, "tokens", tokens);
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
