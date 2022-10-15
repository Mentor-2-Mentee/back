import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { ScheduleType } from "../types";
import { ExamReviewRoom } from "./examReviewRoom.entity";
import { ExamScheduleRelation } from "./examScheduleRelation.entity";

@Table({
  tableName: "ExamSchedule",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class ExamSchedule extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false, field: "organizer" })
  organizer: string;

  @Column({ allowNull: false, field: "exam_date", type: DataType.DATE })
  examDate: Date;

  @Column({ allowNull: true, field: "exam_start_time", type: DataType.TIME })
  examStartTime: Date;

  @Column({ allowNull: true, field: "exam_end_time", type: DataType.TIME })
  examEndTime: Date;

  @Column({ allowNull: true, field: "exam_url" })
  examUrl: string;

  @Column({ allowNull: false, field: "schedule_type" })
  scheduleType: ScheduleType;

  @Column({ allowNull: true, field: "description" })
  description: string;

  @Column({ allowNull: true, field: "image_url", type: DataType.JSON })
  imageUrl: string[];

  @HasMany(() => ExamScheduleRelation, {
    onDelete: "CASCADE",
  })
  examScheduleRelations?: ExamScheduleRelation[];

  @BelongsToMany(() => ExamReviewRoom, () => ExamScheduleRelation)
  examReviewRooms?: ExamReviewRoom[];
}
