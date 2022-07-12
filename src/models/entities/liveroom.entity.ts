import { Column, Model, Table, AutoIncrement } from "sequelize-typescript";

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

  @Column({ allowNull: false })
  imageFiles: string;

  @Column({ allowNull: true })
  parentsTag: string;

  @Column({ allowNull: true })
  roomTags: string;
}
