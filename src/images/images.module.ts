import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";
import DateFormatting from "src/common/utils/DateFormatting";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";

@Module({
  imports: [
    OauthModule,
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
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
