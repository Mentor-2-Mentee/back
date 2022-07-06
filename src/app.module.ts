import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LiveRoomsModule } from "./live-rooms/live-rooms.module";
import { LiveRoom } from "./live-rooms/entities/live-room.entity";
import { LiveChatModule } from "./live-chat/live-chat.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { OauthModule } from "./oauth/oauth.module";

import configuration from "./common/config/configuration";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import * as redisStore from "cache-manager-ioredis";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LiveRoomsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mariadb",
        host: configService.get<string>("MARIADB_HOST"),
        port: parseInt(configService.get<string>("MARIADB_PORT")),
        username: configService.get<string>("MARIADB_USER"),
        password: configService.get<string>("MARIADB_PASSWORD"),
        database: `liveroom`,
        entities: [LiveRoom],
        // synchronize: true, //production에서는 쓰지말것 db가 서버와동기화되어버림
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: `${configService.get<string>("REDIS_HOST")}`,
        port: configService.get<string>("REDIS_PORT"),
      }),
      isGlobal: true,
    }),
    LiveChatModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
