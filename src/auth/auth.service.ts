import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { UserKakaoDto } from "./kakao/dto/user.kakao.dto";
import axios, { AxiosRequestConfig } from "axios";
import configuration from "../config/configuration";
import axiosInstance from "src/api/axiosInstance";

@Injectable()
export class AuthService {
  //   constructor(private usersService: UsersService) {}

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    console.log("입력받은값", username, pass);
    if (user && user.password === pass) {
      //실제로는 bcrypt를 이용한 암호화 작업을 수행후 사용해야 한다!
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getKakaoAccessToken(req) {
    // console.log("auth service req", req.query.code);
    // const config: AxiosRequestConfig = {
    //   headers: {
    //     "Content-type": "application/x-www-form-urlencoded",
    //   },
    // };
    // const param = {
    //   grant_type: "authorization_code",
    //   client_id: configuration().kakaoRestApiKey,
    //   redirect_uri: configuration().kakaoCallbackURL,
    //   code: req.query.code,
    // };
    // try {
    //   const res = await axiosInstance(config).post("/token", param);
    //   console.log(res.data);
    // } catch (error) {
    //   console.log(error);
    // }
    // if (!req) {
    //   return "no user from kakao";
    // }
    // return {
    //   message: "user info from kakao",
    //   user: req,
    // };
  }
}
