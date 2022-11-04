import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import {
  CreateBulkExamQuestionDto,
  ExamQuestion,
  ExamQuestionComment,
  ExamReviewRoom,
  ExamSchedule,
  RawExamQuestion,
  UpdateExamQuestionDto,
  User,
} from "src/models";

@Injectable()
export class ExamQuestionService {
  constructor(
    @InjectModel(ExamQuestion)
    private examQuestionModel: typeof ExamQuestion,
    @InjectModel(ExamSchedule)
    private examScheduleModel: typeof ExamSchedule,
    @InjectModel(ExamReviewRoom)
    private examReviewRoomModel: typeof ExamReviewRoom
  ) {}

  async createBulkQuestion(
    bulkCount: number,
    examOrganizer: string,
    examType: string
  ) {
    const basement = [...Array(bulkCount).keys()].map(() => {
      return {
        questionText: null,
        questionImageUrl: [],
        answerExample: ["", "", "", "", ""],
        solution: "",
        answer: "",
        questionType: "MULTIPLE_CHOICE",
        examOrganizer,
        examType,
      };
    });

    const newQuestionList = await this.examQuestionModel.bulkCreate(basement);
    const questionIdList = newQuestionList.map((question) => question.id);

    return questionIdList;
  }

  async setExamQuestionCount(
    examReviewRoomId: number,
    setQuestionCount: number
  ) {
    const targetExamReviewRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );

    if (
      targetExamReviewRoom.examQuestionId.length === setQuestionCount ||
      setQuestionCount < 0
    )
      return false;
    if (targetExamReviewRoom.examQuestionId.length > setQuestionCount) {
      const deleteQuestionIdList =
        targetExamReviewRoom.examQuestionId.slice(setQuestionCount);
      await this.examReviewRoomModel.update(
        {
          examQuestionId: targetExamReviewRoom.examQuestionId.slice(
            0,
            setQuestionCount
          ),
        },
        { where: { id: examReviewRoomId } }
      );
      for (const targetId of deleteQuestionIdList) {
        await this.deleteQuestion(targetId);
      }
      return true;
    }
    if (targetExamReviewRoom.examQuestionId.length < setQuestionCount) {
      const relation = await targetExamReviewRoom.$get("ExamScheduleRelation");
      const parentSchedule = await relation.$get("examSchedule");
      const bulkCreateCount =
        setQuestionCount - targetExamReviewRoom.examQuestionId.length;
      const createdExamIdList = await this.createBulkQuestion(
        bulkCreateCount,
        parentSchedule.organizer,
        targetExamReviewRoom.examType
      );
      await this.examReviewRoomModel.update(
        {
          examQuestionId: [
            ...targetExamReviewRoom.examQuestionId,
            ...createdExamIdList,
          ],
        },
        { where: { id: examReviewRoomId } }
      );
      return true;
    }
  }

  async deleteQuestion(examQuestionId: number) {
    console.log("delete", examQuestionId);
    await this.examQuestionModel.destroy({
      where: { id: examQuestionId },
    });
  }

  async updateQuestion({ id, questionText, solution }: UpdateExamQuestionDto) {
    await this.examQuestionModel.update(
      {
        questionText,
        solution,
      },
      {
        where: { id },
      }
    );

    return this.findQuestionById(id);
  }

  async findExamQuestionIdListByRoomId(examReviewRoomId: number) {
    const targetRoom = await this.examReviewRoomModel.findByPk(
      examReviewRoomId
    );

    return targetRoom.examQuestionId;
  }

  async findExamQuestionListByQuestionId(examQuestionIdList: number[]) {
    const result = [];
    for (const examQuestionId of examQuestionIdList) {
      const question = await this.examQuestionModel.findByPk(examQuestionId, {
        include: [
          { model: RawExamQuestion, include: [{ model: User }] },
          { model: ExamQuestionComment },
        ],
      });
      result.push(question);
    }

    return result;
  }

  async findQuestionById(examQuestionId: number) {
    const result = await this.examQuestionModel.findByPk(examQuestionId);
    return result;
  }
}
