import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "TestMentoringRoom",
  timestamps: true,
  createdAt: true,
})
export class TestMentoringRoom extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  testMentoringRoomId: string;

  @Column({ allowNull: false })
  testScheduleId: number;

  @Column({ allowNull: false })
  testField: string;

  @Column({ allowNull: false, type: DataType.JSON })
  userList: string;

  @Column({ allowNull: false, type: DataType.JSON })
  chatListBundle: string;

  @Column({ allowNull: false, type: DataType.JSON })
  testQuestionList: string;
}
