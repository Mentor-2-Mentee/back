import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LiveRoomsModule } from "./live-rooms/live-rooms.module";

import { LiveContentsModule } from "./live-contents/live-contents.module";
import { OauthModule } from "./oauth/oauth.module";

import configuration from "./common/config/configuration";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import * as redisStore from "cache-manager-ioredis";
import { User } from "./models/entities/user.entity";
import {
  CreateExamMentoringRoomRequest,
  LiveRoom,
  QuestionTag,
  ExamMentoringRoom,
  ExamSchedule,
  ExamQuestion,
} from "src/models";

import { SequelizeModule } from "@nestjs/sequelize";
import { QuestionTagModule } from "./question-tag/question-tag.module";
import { ExamScheduleModule } from "./exam-schedule/exam-schedule.module";
import { ExamMentoringRoomModule } from "./exam-mentoring-room/exam-mentoring-room.module";
import { ExamQuestionModule } from "./exam-question/exam-question.module";

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
        models: [
          LiveRoom,
          User,
          QuestionTag,
          ExamSchedule,
          CreateExamMentoringRoomRequest,
          ExamMentoringRoom,
          ExamQuestion,
        ],
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: `${configService.get<string>("REDIS_HOST")}`,
        port: configService.get<string>("REDIS_PORT"),
        ttl: 3600,
      }),
      isGlobal: true,
    }),
    LiveContentsModule,
    OauthModule,
    QuestionTagModule,
    ExamScheduleModule,
    ExamMentoringRoomModule,
    ExamQuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
