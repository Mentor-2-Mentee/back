import {
  Column,
  Model,
  Table,
  AutoIncrement,
  DataType,
} from "sequelize-typescript";
@Table({
  tableName: "User",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class User extends Model {
  @AutoIncrement
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    allowNull: false,
  })
  id: string;

  @Column({ allowNull: false, field: "user_name" })
  userName: string;

  @Column({ allowNull: false, field: "oauth_type" })
  oauthType: string;

  @Column({ allowNull: false, field: "oauth_id" })
  oauthId: string;

  @Column({ allowNull: false, field: "user_grade" })
  userGrade: string;

  @Column({ allowNull: true, field: "token_issue_code" })
  tokenIssueCode: string;

  @Column({ allowNull: true, field: "access_token" })
  accessToken: string;

  @Column({ allowNull: true, field: "refresh_token" })
  refreshToken: string;
}
