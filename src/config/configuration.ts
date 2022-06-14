export default () => ({
  kakaoRestApiKey: String(process.env.KAKAO_REST_API_KEY),
  kakaoCallbackURL: String(process.env.KAKAO_CALLBACK_URL),
  kakaoResponseType: String("code"),
});
