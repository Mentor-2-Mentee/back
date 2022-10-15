import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
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
  id!: string;

  @ForeignKey(() => ExamReviewRoom)
  @Column({
    allowNull: false,
  })
  examReviewRoomId: number;

  @BelongsTo(() => ExamReviewRoom)
  examReviewRoom: ExamReviewRoom;

  @ForeignKey(() => ExamSchedule)
  @Column({
    allowNull: false,
  })
  examScheduleId: number;

  @BelongsTo(() => ExamSchedule)
  examSchedule: ExamSchedule;
}
