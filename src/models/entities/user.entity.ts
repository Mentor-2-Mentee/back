import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  DefaultScope,
  Scopes,
  ForeignKey,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import { QuestionPost } from "./questionPost.entity";

@DefaultScope(() => ({
  attributes: ["id", "userName", "userGrade"],
}))
@Scopes(() => ({
  full: {
    attributes: [
      "id",
      "userName",
      "userGrade",
      "tokenIssueCode",
      "accessToken",
      "refreshToken",
    ],
  },
}))
@Table({
  tableName: "User",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class User extends Model {
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

  @HasMany(() => QuestionPost)
  questionPost: QuestionPost;

  // @ManyToMany(() => ExamReviewRoom, "adminUserId")
  // examReviewRoom: ExamReviewRoom;

  // @HasMany(() => ExamReviewRoom, "participantUserId")
  // examReviewRoom: ExamReviewRoom;

  // @HasMany(() => ExamReviewRoom, "nonParticipantUserId")
  // examReviewRoom: ExamReviewRoom;
}
