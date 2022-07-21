import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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

    const result = await this.questionTagModel.create({
      parentTag: createQuestionTagDto.parentTag,
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
