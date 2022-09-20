import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions, Op } from "sequelize";
import { DeleteQuestionTagDto, QuestionTag } from "src/models";
import { CreateQuestionTagDto } from "src/models/dto/create-questionTag.dto";

@Injectable()
export class QuestionTagService {
  constructor(
    @InjectModel(QuestionTag)
    private questionTagModel: typeof QuestionTag
  ) {}
  async createTag(
    createQuestionTagDto: CreateQuestionTagDto
  ): Promise<false | QuestionTag> {
    const searchTagQuerys: WhereOptions = [];
    if (createQuestionTagDto.parentTag !== undefined) {
      searchTagQuerys.push({
        parentTag: {
          [Op.eq]: createQuestionTagDto.parentTag,
        },
      });
    }

    searchTagQuerys.push({
      tagName: {
        [Op.eq]: createQuestionTagDto.tagName,
      },
    });
    try {
    } catch (error) {
      console.log("createTag Error:", error);
      return error;
    }

    const checkExist = await this.questionTagModel.findAll({
      where: {
        [Op.and]: searchTagQuerys,
      },
    });
    if (checkExist.length !== 0) {
      return false;
    }

    const result = await this.questionTagModel.create({
      parentTag:
        createQuestionTagDto.parentTag === undefined
          ? null
          : createQuestionTagDto.parentTag,
      tagName: createQuestionTagDto.tagName,
    });

    return result;
  }

  async findAllTags() {
    try {
      const result = await this.questionTagModel.findAll();
      return result;
    } catch (error) {
      console.log("findAllTags Error:", error);
    }
  }

  async deleteParentsFamilyTag(DeleteQuestionTagDto: DeleteQuestionTagDto) {
    try {
      await this.questionTagModel.destroy({
        where: {
          parentTag: null,
          tagName: DeleteQuestionTagDto.tagName,
        },
      });
      await this.questionTagModel.destroy({
        where: {
          parentTag: DeleteQuestionTagDto.tagName,
        },
      });
    } catch (error) {
      console.log("deleteParentsFamilyTag Error:", error);
      return error;
    }
  }

  async deleteChildTag(DeleteQuestionTagDto: DeleteQuestionTagDto) {
    try {
      await this.questionTagModel.destroy({
        where: {
          parentTag: DeleteQuestionTagDto.parentTag,
          tagName: DeleteQuestionTagDto.tagName,
        },
      });
    } catch (error) {
      console.log("deleteChildTag Error:", error);
      return error;
    }
  }
}
