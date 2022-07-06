import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import configuration from "./common/config/configuration";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  await app.listen(configuration().apiServerPort, "0.0.0.0");
  console.log("server start");
}
bootstrap();
