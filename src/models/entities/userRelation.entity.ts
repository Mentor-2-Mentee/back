import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
// import { ExamReviewRoom } from "./examReviewRoom.entity";
import { QuestionPost } from "./questionPost.entity";
import { User } from "./user.entity";

@Table({
  tableName: "UserRelation",
  charset: "utf8",
  createdAt: false,
  updatedAt: false,
})
export class UserRelation extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    field: "user_id",
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => QuestionPost)
  @Column({
    allowNull: true,
    field: "question_post_id",
  })
  questionPostId: number;

  @BelongsTo(() => QuestionPost)
  questionPost: QuestionPost;
}
