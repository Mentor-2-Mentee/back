import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { CreateExamReviewRoomRequest } from "./createExamReviewRoomRequest.entity";
import { ExamReviewRoom } from "./examReviewRoom.entity";
import { ExamSchedule } from "./examSchedule.entity";

@Table({
  tableName: "ExamScheduleRelation",
  charset: "utf8",
  createdAt: false,
  updatedAt: false,
})
export class ExamScheduleRelation extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => ExamSchedule)
  @Column({
    allowNull: false,
    field: "exam_schedule_id",
  })
  examScheduleId: number;

  @BelongsTo(() => ExamSchedule)
  examSchedule: ExamSchedule;

  @ForeignKey(() => ExamReviewRoom)
  @Column({
    allowNull: true,
    field: "exam_review_room_id",
  })
  examReviewRoomId: number;

  @BelongsTo(() => ExamReviewRoom)
  examReviewRoom: ExamReviewRoom;

  @ForeignKey(() => CreateExamReviewRoomRequest)
  @Column({
    allowNull: true,
    field: "create_review_room_request_id",
  })
  createExamReviewRoomRequestId: number;

  @BelongsTo(() => CreateExamReviewRoomRequest)
  createExamReviewRoomRequest: CreateExamReviewRoomRequest;
}
