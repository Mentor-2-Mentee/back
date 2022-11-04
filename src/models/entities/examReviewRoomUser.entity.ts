import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { ExamReviewRoom } from "./examReviewRoom.entity";
import { RawExamQuestion } from "./rawExamQuestion.entity";
import { User } from "./user.entity";

@Table({
  tableName: "ExamReviewRoomUser",
  timestamps: true,
  createdAt: "enteredAt",
  updatedAt: false,
})
export class ExamReviewRoomUser extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => ExamReviewRoom)
  @Column({
    allowNull: false,
    field: "exam_review_room_id",
  })
  examReviewRoomId: number;

  @BelongsTo(() => ExamReviewRoom)
  examReviewRoom: ExamReviewRoom;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: "user_id",
  })
  userId: string;

  @BelongsTo(() => User)
  userProfile: User;

  @Column({
    allowNull: false,
    field: "user_position",
  })
  userPosition: string;

  @Column({
    allowNull: false,
    field: "is_participant",
  })
  isParticipant: boolean;

  @HasMany(() => RawExamQuestion)
  rawExamQuestionList: RawExamQuestion[];
}
