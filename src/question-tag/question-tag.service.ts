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
  async createTag(createQuestionTagDto: CreateQuestionTagDto) {
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
      const checkExist = await this.questionTagModel.findAll({
        where: {
          [Op.and]: searchTagQuerys,
        },
      });
      if (checkExist.length !== 0) {
        throw new Error("already exist tag");
      }
    } catch (error) {
      console.log("createTag Error:", error);
      return error;
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
      const deleteParent = await this.questionTagModel.destroy({
        where: {
          parentTag: null,
          tagName: DeleteQuestionTagDto.tagName,
        },
      });
      const deleteChilds = await this.questionTagModel.destroy({
        where: {
          parentTag: DeleteQuestionTagDto.tagName,
        },
      });
      return `delete ${deleteParent + deleteChilds}Tags complete`;
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
      return `delete ${DeleteQuestionTagDto.tagName}Tag complete`;
    } catch (error) {
      console.log("deleteChildTag Error:", error);
      return error;
    }
  }
}
