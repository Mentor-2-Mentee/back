import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize/types";
import { QuestionTag } from "src/models";
import { CreateQuestionTagDto } from "src/models/dto/create-questionTag.dto";

@Injectable()
export class QuestionTagService {
  constructor(
    @InjectModel(QuestionTag)
    private questionTagModel: typeof QuestionTag
  ) {}
  async createTag(createQuestionTagDto: CreateQuestionTagDto) {
    console.log("받은값", createQuestionTagDto, createQuestionTagDto.parentTag);

    const checkExist = await this.questionTagModel.findAll({
      where: {
        parentFilterTag: createQuestionTagDto.parentTag,
        tagName: createQuestionTagDto.tagName,
      },
    });

    if (checkExist.length !== 0) {
      return "already exist!!";
    }

    const result = await this.questionTagModel.create({
      parentFilterTag: createQuestionTagDto.parentTag,
      tagName: createQuestionTagDto.tagName,
    });

    return result;
  }

  async findAllTags() {
    const result = await this.questionTagModel.findAll();
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} questionTag`;
  }

  update(id: number, updateQuestionTagDto: any) {
    return `This action updates a #${id} questionTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} questionTag`;
  }
}
