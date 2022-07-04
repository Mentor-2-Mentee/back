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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";
import { Cache } from "cache-manager";
import { MessagePattern } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/token")
  sendToken(@Body() bodyParam: any) {
    const tokens = this.authService.sendToken(bodyParam.code);
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
