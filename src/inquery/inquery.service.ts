import { Injectable, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  AuthorizeUserProfile,
  CreateInqueryDto,
  User,
  UserTokenValidateResultType,
} from "src/models";
import { Inquery } from "src/models/entities/inquery.entity";

@Injectable()
export class InqueryService {
  constructor(
    @InjectModel(Inquery)
    private inqueryModel: typeof Inquery
  ) {}

  async findInqueryListOne(
    inqueryId: number,
    password?: string,
    userId?: string
  ) {
    console.log(inqueryId, password, userId);
    const targetInquery = await this.inqueryModel.findByPk(inqueryId);

    if (targetInquery.isPrivate) {
      if (
        targetInquery.guestPassword !== null &&
        targetInquery.guestPassword !== password
      )
        return false;

      if (
        targetInquery.guestPassword === null &&
        targetInquery.authorId !== userId
      )
        return false;
    }

    return targetInquery;
  }

  async findInqueryListAll(page: number, limit: number) {
    return await this.inqueryModel.findAll({
      include: [{ model: User }, { model: Inquery }],
      order: [["id", "DESC"]],
      offset: (page - 1) * limit,
      limit,
      attributes: ["id", "title", "createdAt", "guestName", "isPrivate"],
    });
  }

  async createNewInquery(
    {
      title,
      description,
      guestName,
      guestPassword,
      isPrivate,
      targetInqueryId,
    }: CreateInqueryDto,
    ip: string,
    userData?: UserTokenValidateResultType
  ) {
    const spiltedIp = ip.split(".");
    return await this.inqueryModel.create({
      title,
      description,
      authorId: userData?.id || null,
      guestName:
        userData !== undefined
          ? null
          : `${guestName}(${spiltedIp[0]}.${spiltedIp[1]})`,
      guestPassword: userData !== undefined ? null : guestPassword,
      isPrivate,
      targetInqueryId,
    });
  }
}
