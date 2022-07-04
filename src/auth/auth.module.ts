import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PassportModule } from "@nestjs/passport"; //주입된 passport전략 모듈을 주입
import { UsersModule } from "src/users/users.module"; // 검증할 유저에 대한 모듈을 주입
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { KakaoStrategy } from "./kakao/kakao.strategy";
import { LocalStrategy } from "./local/local.strategy"; // LocalStrategy로 내보낸 커스텀 passport localstrategy를 주입

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, KakaoStrategy],
  exports: [AuthService],
})
export class AuthModule {}
