import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { ExamScheduleRelation } from "./examScheduleRelation.entity";
@Table({
  tableName: "CreateExamReviewRoomRequest",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class CreateExamReviewRoomRequest extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  examScheduleId: number;

  /**
   * ex: 화공직
   */
  @Column({ allowNull: false, field: "exam_type" })
  examType: string;

  @Column({
    allowNull: true,
    field: "participant_user_id",
    type: DataType.JSON,
  })
  participantUserId: string[];

  @Column({
    allowNull: true,
    field: "non_participant_user_id",
    type: DataType.JSON,
  })
  nonParticipantUserId: string[];

  @HasMany(() => ExamScheduleRelation)
  ExamScheduleRelation?: ExamScheduleRelation;
}
