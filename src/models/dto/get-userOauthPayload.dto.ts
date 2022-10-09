import { OauthType } from "../types";

export class GetUserOauthPayloadDto {
  userName: string;
  oauthType: OauthType;
  oauthId: string;
}
