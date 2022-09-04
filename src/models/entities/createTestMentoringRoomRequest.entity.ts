import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "CreateTestMentoringRoomRequest",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class CreateTestMentoringRoomRequest extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  testScheduleId: number;

  @Column({ allowNull: false })
  testField: string;

  @Column({ allowNull: false, type: DataType.JSON })
  requestUserList: string;
}
