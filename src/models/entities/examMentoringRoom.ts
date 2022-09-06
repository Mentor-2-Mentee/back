import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "ExamMentoringRoom",
  timestamps: true,
  createdAt: true,
})
export class ExamMentoringRoom extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  examMentoringRoomId: string;

  @Column({ allowNull: false })
  examScheduleId: number;

  @Column({ allowNull: false })
  examField: string;

  @Column({ allowNull: false, type: DataType.JSON })
  userList: string;

  @Column({ allowNull: false, type: DataType.JSON })
  chatListBundle: string;

  @Column({ allowNull: false, type: DataType.JSON })
  examQuestionList: string;
}
