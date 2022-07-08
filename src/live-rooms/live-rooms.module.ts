import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { LiveRoomsController } from "./live-rooms.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigModule, ConfigService } from "@nestjs/config";

import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path/posix";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LiveRoom } from "./entities/live-room.entity";
import DateFormatting from "src/common/utils/DateFormatting";

@Module({
  imports: [
    OauthModule,
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
    TypeOrmModule.forFeature([LiveRoom]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, done) => {
            const dest = `${configService.get<string>("IMAGE_STORAGE_DEST")}/${
              new DateFormatting(new Date()).YYYY_MM_DD
            }/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            done(null, dest);
          },
          filename: (req, file, done) => {
            const randomImageName = uuidv4();
            return done(
              null,
              `${randomImageName}${extname(file.originalname)}`
            );
          },
        }),
      }),
    }),
  ],
  controllers: [LiveRoomsController],
  providers: [LiveRoomsService],
})
export class LiveRoomsModule {}
