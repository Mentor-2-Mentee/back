export default () => ({
  clientURL: String(process.env.CLIENT_URL),
  apiServerPort: Number(process.env.API_SERVER_PORT),
  kakaoRestApiKey: String(process.env.KAKAO_REST_API_KEY),
  kakaoCallbackURL: String(process.env.KAKAO_CALLBACK_URL),
  kakaoResponseType: String("code"),
  AuthCallbackURL: String(process.env.AUTH_CALLBACK_URL),
  jwtSecret: String(process.env.JWT_SECRET),
  jwtRefreshExpireTime: String(process.env.JWT_REFRESH_EXPIRE_TIME),
  imageStorageDEst: String(process.env.IMAGE_STORAGE_DEST),
});
