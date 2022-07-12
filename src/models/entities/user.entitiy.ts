import { Column, Model, Table, AutoIncrement } from "sequelize-typescript";
@Table({
  tableName: "Users",
  timestamps: true,
  createdAt: true,
  updatedAt: "updatedAt",
})
export class User extends Model<User> {
  @AutoIncrement
  @Column({
    primaryKey: true,
  })
  id: number;

  @Column({ allowNull: false })
  userId: number;

  @Column({ allowNull: false })
  username: string;
}
