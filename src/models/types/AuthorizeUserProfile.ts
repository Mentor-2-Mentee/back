import { User } from "../entities";

export class AuthorizeUserProfile implements Express.User {
  user: User;
}
