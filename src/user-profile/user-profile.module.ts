import { Module } from "@nestjs/common";
import { UserProfileService } from "./user-profile.service";
import { UserProfileController } from "./user-profile.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
