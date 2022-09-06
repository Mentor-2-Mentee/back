import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "ExamSchedule",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class ExamSchedule extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  examScheduleId: number;

  @Column({ allowNull: false })
  examScheduleTitle: string;

  @Column({ allowNull: true })
  examUrl: string;

  @Column({ allowNull: false, type: DataType.DATE })
  examDate: Date;

  @Column({ allowNull: false })
  examField: string;

  @Column({ allowNull: true })
  examDescription: string;

  @Column({ allowNull: true, type: DataType.JSON })
  imageFiles: string;
}
