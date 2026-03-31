// Use an absolute HTTPS endpoint if you want the chatbot to work from file:// preview.
// A relative path such as /api/chat only works when the site is served over HTTP(S).
window.AA_CHATBOT_CONFIG={
  enabled:true,
  endpoint:"https://gerontology.vercel.app/api/chat",
  title:"AI 챗봇",
  welcomeMessage:"",
  placeholder:"공개된 강의자료 내용을 물어보세요.",
  disconnectedMessage:"아직 API 엔드포인트가 연결되지 않았습니다. 정적 사이트에는 OpenAI 키를 넣지 말고, 외부 서버리스 프록시 URL만 endpoint에 넣은 뒤 다시 빌드하세요.",
  requestTimeoutMs:45000,
  maxMaterials:6
};
