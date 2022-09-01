import { User } from "../entities";

export class AuthUserRequestDto implements Express.User {
  user: User;
}
