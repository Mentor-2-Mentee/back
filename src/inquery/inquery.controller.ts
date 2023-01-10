import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { CreateInqueryDto } from "src/models";
import { OauthService } from "src/oauth/oauth.service";
import { InqueryService } from "./inquery.service";

@Controller("inquery")
export class InqueryController {
  constructor(
    private readonly inqueryService: InqueryService,
    private readonly oauthService: OauthService
  ) {}

  @Get()
  async findInqueryOne(
    @Req() req: Request,
    @Query("inqueryId") inqueryId: string,
    @Query("password") password?: string
  ) {
    console.log("/GET", inqueryId, password);
    const accessToken = req.headers.authorization.split(" ")[1];
    const userData = this.oauthService.validateToken(accessToken);
    const inquery = await this.inqueryService.findInqueryListOne(
      Number(inqueryId),
      password,
      userData?.id
    );

    if (inquery === false)
      throw new HttpException("Unauthorized user", HttpStatus.UNAUTHORIZED);

    return {
      message: "OK",
      inquery,
    };
  }

  @Get("/list")
  async findInqueryList(
    @Query("page") page: string,
    @Query("limit") limit: string
  ) {
    console.log("/GET /list", page, limit);
    const inqueryList = await this.inqueryService.findInqueryListAll(
      Number(page),
      Number(limit)
    );

    return {
      message: "OK",
      inqueryList,
    };
  }

  @Post()
  async createNewInquery(@Req() req: Request, @Body() body: CreateInqueryDto) {
    console.log(req.headers.cookie);
    const ip = String(
      req.headers["x-forwarded-for"] || req.socket.remoteAddress
    );
    const accessToken = req.headers.authorization.split(" ")[1];
    const userData = this.oauthService.validateToken(accessToken);
    const newInquery = this.inqueryService.createNewInquery(body, ip, userData);

    return {
      message: "등록 완료",
      newInquery,
    };
  }

  @Put()
  async updateNewInquery() {}

  @Delete()
  async deleteNewInquery() {}
}
