import { Table, Model, AutoIncrement, Column } from "sequelize-typescript";

@Table({
  tableName: "TableSchedule",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class TestSchedule extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  scheduleId: number;

  @Column({ allowNull: false })
  scheduleTitle: string;

  @Column({ allowNull: false })
  scheduleDate: Date;
}

/**
 * @TestScheduleMap : Map<Date().toString(), TestSchedule[]>
 * 특정 일에 실행예정인 스케쥴 리스트를 Map으로 반환
 */
export type TestScheduleMap = Map<string, TestSchedule[]>;
