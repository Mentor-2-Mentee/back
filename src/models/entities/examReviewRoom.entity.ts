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
} from "sequelize-typescript";
import { ExamQuestion } from "./examQuestion.entity";
import { ExamSchedule } from "./examSchedule.entity";
import { ExamScheduleRelation } from "./examScheduleRelation.entity";
import { User } from "./user.entity";
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

  /**
   * ex: 서부발전
   */
  @Column({ allowNull: false, field: "exam_organizer" })
  examOrganizer: string;

  // @ForeignKey(() => ExamQuestion)
  @Column({ allowNull: false, field: "exam_question_id", type: DataType.JSON })
  examQuestionId: number[];

  // @BelongsTo(() => ExamQuestion)
  // examQuestion: ExamQuestion[];

  // @ForeignKey(() => User)
  @Column({ allowNull: false, field: "admin_user_id", type: DataType.JSON })
  adminUserId: string[];

  // @BelongsTo(() => ExamQuestion)
  // adminUser: User[];

  // @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: "participant_user_id",
    type: DataType.JSON,
  })
  participantUserId: string[];

  // @BelongsTo(() => ExamQuestion)
  // participantUser: User[];

  // @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: "non_participant_user_id",
    type: DataType.JSON,
  })
  nonParticipantUserId: string[];

  // @BelongsTo(() => ExamQuestion)
  // nonParticipantUser: User[];

  @HasMany(() => ExamScheduleRelation)
  ExamScheduleRelation?: ExamScheduleRelation;
}
