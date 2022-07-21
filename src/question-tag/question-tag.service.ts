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
    console.log("받은값", createQuestionTagDto, createQuestionTagDto.parentTag);

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

    const checkExist = await this.questionTagModel.findAll({
      where: {
        [Op.and]: searchTagQuerys,
      },
    });

    if (checkExist.length !== 0) {
      return "already exist!!";
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
    const result = await this.questionTagModel.findAll();
    return result;
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
      return `delete ${DeleteQuestionTagDto.tagName}Tags complete`;
    } catch (error) {
      console.log("deleteChildTag Error:", error);
      return error;
    }
  }
}
