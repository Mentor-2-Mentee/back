import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
import { Sequelize } from "sequelize";
@Table({
  tableName: "Liverooms",
  timestamps: true,
  createdAt: true,
  updatedAt: "startedAt",
})
export class LiveRoom extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  roomId: string;

  @Column({ allowNull: false })
  roomTitle: string;

  @Column({ allowNull: true })
  explainRoomText: string;

  @Column({ allowNull: false })
  author: string;

  @Column({ allowNull: false, type: DataType.JSON })
  imageFiles: string;

  @Column({ allowNull: true })
  rootFilterTag: string;

  @Column({ allowNull: true, type: DataType.JSON })
  roomTags: string;
}
