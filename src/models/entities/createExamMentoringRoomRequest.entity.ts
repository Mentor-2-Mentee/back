import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "CreateExamMentoringRoomRequest",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class CreateExamMentoringRoomRequest extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  examScheduleId: number;

  @Column({ allowNull: false })
  examField: string;

  @Column({ allowNull: false, type: DataType.JSON })
  requestUserList: string;
}
