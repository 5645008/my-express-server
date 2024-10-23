const express = require("express");
const path = require("path");

const app = express();

// 포트 설정 (5000번 포트를 기본값으로 사용)
app.set("port", process.env.PORT || 3000);

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, "my-app/build")));

// 기본 경로에서 빌드된 index.html 파일 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/my-app/build/index.html"));
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중..");
});