import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import { ExamReviewRoom } from "./examReviewRoom.entity";
import { User } from "./user.entity";

@Table({
  tableName: "ExamReviewRoomChat",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: false,
  deletedAt: "deletedAt",
})
export class ExamReviewRoomChat extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => ExamReviewRoom)
  @Column({ allowNull: false, field: "exam_review_room_id" })
  examReviewRoomId: number;

  @BelongsTo(() => ExamReviewRoom)
  examReviewRoom: ExamReviewRoom;

  @ForeignKey(() => User)
  @Column({ allowNull: false, field: "author_id" })
  authorId: string;

  @BelongsTo(() => User)
  authorInfo: User;

  @Column({ allowNull: false, field: "chat" })
  chat: string;
}