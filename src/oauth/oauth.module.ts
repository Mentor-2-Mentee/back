import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport"; //주입된 passport전략 모듈을 주입
import { OauthController } from "./oauth.controller";
import { OauthService } from "./oauth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { KakaoStrategy } from "./kakao/kakao.strategy";
import { User } from "../models/entities/user.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: `${configService.get<string>("JWT_ACCESS_EXPIRE_TIME")}`,
        },
      }),
    }),
    ClientsModule.register([
      { name: "AUTH_SERVICE", transport: Transport.TCP },
    ]),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [OauthController],
  providers: [OauthService, JwtStrategy, KakaoStrategy],
  exports: [OauthService],
})
export class OauthModule {}
