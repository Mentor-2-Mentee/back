import {
  Table,
  Model,
  AutoIncrement,
  Column,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "TestSchedule",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class TestSchedule extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  testScheduleId: number;

  @Column({ allowNull: false })
  testScheduleTitle: string;

  @Column({ allowNull: true })
  testUrl: string;

  @Column({ allowNull: false, type: DataType.DATE })
  testDate: Date;

  @Column({ allowNull: false })
  testField: string;

  @Column({ allowNull: true })
  testDescription: string;

  @Column({ allowNull: true, type: DataType.JSON })
  imageFiles: string;
}
