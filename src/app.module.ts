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
  CreateExamReviewRoomRequest,
  LiveRoom,
  QuestionTag,
  ExamReviewRoom,
  ExamSchedule,
  ExamQuestion,
  Question,
  QuestionPost,
  ExamScheduleRelation,
  UserRelation,
  QuestionPostComment,
  ExamQuestionComment,
  RawExamQuestion,
  ExamReviewRoomUser,
  ExamReviewRoomChat,
} from "src/models";

import { SequelizeModule } from "@nestjs/sequelize";
import { QuestionTagModule } from "./question-tag/question-tag.module";
import { ExamScheduleModule } from "./exam-schedule/exam-schedule.module";
import { ExamReviewRoomModule } from "./exam-review-room/exam-review-room.module";
import { ExamQuestionModule } from "./exam-question/exam-question.module";
import { ImagesModule } from "./images/images.module";
import { QuestionModule } from "./question/question.module";
import { QuestionPostModule } from "./question-post/question-post.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { QuestionPostCommentModule } from "./question-post-comment/question-post-comment.module";
import { PdfModule } from "./pdf/pdf.module";
import { ExamQuestionCommentModule } from "./exam-question-comment/exam-question-comment.module";
import { RawExamQuestionModule } from "./raw-exam-question/raw-exam-question.module";
import { ExamReviewRoomUserModule } from "./exam-review-room-user/exam-review-room-user.module";
import { ExamReviewRoomChatModule } from "./exam-review-room-chat/exam-review-room-chat.module";

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
          UserRelation,
          QuestionTag,
          ExamSchedule,
          ExamScheduleRelation,
          CreateExamReviewRoomRequest,
          ExamReviewRoom,
          ExamQuestion,
          Question,
          QuestionPost,
          QuestionPostComment,
          ExamQuestionComment,
          RawExamQuestion,
          ExamReviewRoomUser,
          ExamReviewRoomChat,
        ],
        logging: Boolean(
          configService.get<string>("LIVE_SERVER_MODE") === "true"
        ),
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
    ExamReviewRoomModule,
    ExamQuestionModule,
    ImagesModule,
    QuestionModule,
    QuestionPostModule,
    UserProfileModule,
    QuestionPostCommentModule,
    PdfModule,
    ExamQuestionCommentModule,
    RawExamQuestionModule,
    ExamReviewRoomUserModule,
    ExamReviewRoomChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [CacheModule],
})
export class AppModule {}
