import { Module } from "@nestjs/common";
import { LiveRoomsService } from "./live-rooms.service";
import { LiveRoomsController } from "./live-rooms.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigModule, ConfigService } from "@nestjs/config";

import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { LiveRoom } from "../models/entities/liveroom.entity";
import DateFormatting from "src/common/utils/DateFormatting";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserProfileModule } from "src/user-profile/user-profile.module";

@Module({
  imports: [
    UserProfileModule,
    SequelizeModule.forFeature([LiveRoom]),
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
