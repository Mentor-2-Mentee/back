import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "ExamReviewRoom",
  timestamps: true,
  createdAt: true,
})
export class ExamReviewRoom extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  examReviewRoomId: string;

  @Column({ allowNull: false })
  examScheduleTitle: string;

  @Column({ allowNull: false })
  examScheduleId: number;

  @Column({ allowNull: false })
  examField: string;

  @Column({ allowNull: false, type: DataType.JSON })
  userList: number[];

  @Column({ allowNull: false, type: DataType.JSON })
  chatListBundle: string;

  @Column({ allowNull: false, type: DataType.JSON })
  examQuestionList: number[];
}
