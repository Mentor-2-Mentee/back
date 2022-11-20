import { Module } from "@nestjs/common";
import { InqueryService } from "./inquery.service";
import { InqueryController } from "./inquery.controller";
import { OauthModule } from "src/oauth/oauth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Inquery } from "src/models/entities/inquery.entity";

@Module({
  imports: [OauthModule, SequelizeModule.forFeature([Inquery])],
  controllers: [InqueryController],
  providers: [InqueryService],
})
export class InqueryModule {}
