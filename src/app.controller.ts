import { Controller, Get, Req } from "@nestjs/common";
import { AppService } from "./app.service";
import { Request } from "express";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/health")
  getServerState(@Req() req: Request) {
    return "OK";
  }
}
