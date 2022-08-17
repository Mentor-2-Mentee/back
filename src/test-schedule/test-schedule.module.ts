import { Module } from "@nestjs/common";
import { TestScheduleService } from "./test-schedule.service";
import { TestScheduleController } from "./test-schedule.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { TestSchedule } from "src/models";
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
    SequelizeModule.forFeature([TestSchedule]),
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
  controllers: [TestScheduleController],
  providers: [TestScheduleService],
})
export class TestScheduleModule {}
