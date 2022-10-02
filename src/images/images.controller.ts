import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import configuration from "src/common/config/configuration";
import { ImagesService } from "./images.service";

const MAX_IMAGE_COUNT = 10;

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("image[]", MAX_IMAGE_COUNT))
  async saveImages(
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const imageUrl: string[] = files.map((file) => {
      const rootDirName = new RegExp("public/");
      const savedPath = `${
        configuration().apiServerBaseURL
      }/${file.path.replace(rootDirName, "")}`;
      return savedPath;
    });

    return {
      message: "image upload success",
      url: imageUrl,
    };
  }
}
