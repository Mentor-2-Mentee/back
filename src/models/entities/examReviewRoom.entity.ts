import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasOne,
  Index,
} from "sequelize-typescript";
import { ExamQuestion } from "./examQuestion.entity";
import { ExamSchedule } from "./examSchedule.entity";
import { ExamScheduleRelation } from "./examScheduleRelation.entity";
import { User } from "./user.entity";
import { UserRelation } from "./userRelation.entity";
@Table({
  tableName: "ExamReviewRoom",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class ExamReviewRoom extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  /**
   * ex: 화공직
   */
  @Column({ allowNull: false, field: "exam_type" })
  examType: string;

  @ForeignKey(() => ExamSchedule)
  @Column({ allowNull: false, field: "exam_schedule_id" })
  examScheduleId: number;

  @BelongsTo(() => ExamSchedule)
  examSchedule: ExamSchedule;

  @Column({ allowNull: false, field: "exam_question_id", type: DataType.JSON })
  examQuestionId: number[];

  @Column({ allowNull: false, field: "admin_user_id", type: DataType.JSON })
  adminUserId: string[];

  @Column({
    allowNull: false,
    field: "participant_user_id",
    type: DataType.JSON,
  })
  participantUserId: string[];

  @Column({
    allowNull: false,
    field: "non_participant_user_id",
    type: DataType.JSON,
  })
  nonParticipantUserId: string[];

  @HasOne(() => ExamScheduleRelation, {
    onDelete: "CASCADE",
  })
  ExamScheduleRelation?: ExamScheduleRelation;

  @HasMany(() => UserRelation, {
    onDelete: "CASCADE",
  })
  userRelations?: UserRelation[];
}
