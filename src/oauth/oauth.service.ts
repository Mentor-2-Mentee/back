import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/models";
import configuration from "../common/config/configuration";
import { GetUserOauthPayloadDto } from "src/models/dto";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OauthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async findOrCreateUserByOauth({
    userName,
    oauthType,
    oauthId,
  }: GetUserOauthPayloadDto) {
    return await this.userModel.findOrCreate({
      where: {
        [Op.and]: [{ oauthType }, { oauthId }],
      },
      defaults: {
        userName,
        oauthType,
        oauthId,
        userGrade: "user",
      },
    });
  }

  async createToken({ id, userName, userGrade }: User) {
    const tokenIssueCode = uuidv4();
    const accessToken = this.jwtService.sign({ id, userName, userGrade });
    const refreshToken = this.jwtService.sign(
      { id, userName, userGrade },
      {
        expiresIn: `${configuration().jwtRefreshExpireTime}`,
      }
    );

    await this.userModel.update(
      {
        tokenIssueCode,
        accessToken,
        refreshToken,
      },
      { where: { id } }
    );

    return tokenIssueCode;
  }

  async sendToken(tokenIssueCode: string) {
    const { accessToken, refreshToken } = await this.userModel
      .scope("full")
      .findOne({
        where: { tokenIssueCode },
      });

    return {
      accessToken,
      refreshToken,
    };
  }
}
