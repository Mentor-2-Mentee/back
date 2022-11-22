import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";

@Table({
  tableName: "Inquery",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
})
export class Inquery extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false, field: "title" })
  title: string;

  @Column({ allowNull: false, field: "description" })
  description: string;

  @ForeignKey(() => User)
  @Column({ allowNull: true, field: "author_id" })
  authorId: string;

  @BelongsTo(() => User)
  author: User;

  @Column({ allowNull: true, field: "guest_name" })
  guestName: string;

  @Column({ allowNull: true, field: "guest_password" })
  guestPassword: string;

  @Column({ allowNull: true, field: "is_private" })
  isPrivate: boolean;

  @ForeignKey(() => Inquery)
  @Column({ allowNull: true, field: "target_inquery_id" })
  targetInqueryId: number;

  @BelongsTo(() => Inquery)
  targetInquery: Inquery;
}
