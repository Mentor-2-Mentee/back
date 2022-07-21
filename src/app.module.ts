import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LiveRoomsModule } from "./live-rooms/live-rooms.module";

import { LiveChatModule } from "./live-chat/live-chat.module";
import { OauthModule } from "./oauth/oauth.module";

import configuration from "./common/config/configuration";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import * as redisStore from "cache-manager-ioredis";
import { User } from "./models/entities/user.entitiy";
import { LiveRoom, QuestionTag } from "src/models";

import { SequelizeModule } from "@nestjs/sequelize";
import { QuestionTagModule } from "./question-tag/question-tag.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    LiveRoomsModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "mariadb",
        host: configService.get<string>("MARIADB_HOST"),
        port: parseInt(configService.get<string>("MARIADB_PORT")),
        username: configService.get<string>("MARIADB_USER"),
        password: configService.get<string>("MARIADB_PASSWORD"),
        database: "M2M",
        models: [LiveRoom, User, QuestionTag],
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
    QuestionTagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
