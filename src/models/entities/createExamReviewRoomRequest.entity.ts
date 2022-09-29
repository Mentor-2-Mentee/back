import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "CreateExamReviewRoomRequest",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class CreateExamReviewRoomRequest extends Model {
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
