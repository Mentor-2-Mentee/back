import { Module } from "@nestjs/common";
import { ExamQuestionService } from "./exam-question.service";
import { ExamQuestionController } from "./exam-question.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { ExamReviewRoom, ExamQuestion } from "src/models";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";
import DateFormatting from "src/common/utils/DateFormatting";
import * as fs from "fs";
import { extname } from "path";

@Module({
  imports: [
    SequelizeModule.forFeature([ExamQuestion, ExamReviewRoom]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, done) => {
            const dest = `${configService.get<string>(
              "EXAM_QUESTION_IMAGE_DEST"
            )}/`;

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }

            done(null, dest);
          },
          filename: (req, file, done) => {
            const timeStamp = new DateFormatting(new Date());
            const imageName = `exam-question_${req.body.examQuestionId}_${timeStamp.YYYY_MM_DD}_${timeStamp.HH_MM_SS}`;
            return done(null, `${imageName}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [ExamQuestionController],
  providers: [ExamQuestionService],
  exports: [ExamQuestionService],
})
export class ExamQuestionModule {}
