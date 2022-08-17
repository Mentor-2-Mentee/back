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

  @Column({ allowNull: false })
  testUrl: string;

  @Column({ allowNull: false, type: DataType.DATE })
  testDate: Date;

  @Column({ allowNull: false })
  testField: string;

  @Column({ allowNull: false })
  testDescription: string;

  @Column({ allowNull: false, type: DataType.JSON })
  imageFiles: string;
}
