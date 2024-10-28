const express = require("express");
const path = require("path");
const mysql = require("mysql2");  // MySQL 모듈 불러오기
const cors = require('cors'); // cors 패키지 불러오기

const app = express();
app.use(cors({
  origin: '*'  // 모든 도메인에서의 요청을 허용
}));
app.use(express.json());  // JSON 요청을 처리할 수 있도록 설정

// 포트 설정 (3000번 포트를 기본값으로 사용)
app.set("port", process.env.PORT || 3000);

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, "my-app/build")));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: '52.78.154.108',           // EC2 서버에서 MySQL이 실행 중인 경우 'localhost'
  port: '3306',                // MySQL 포트번호
  user: 'user',                // MySQL 사용자 이름
  password: '0000',            // MySQL 비밀번호
  database: 'my_database'      // 연결할 데이터베이스 이름
});

// MySQL 연결 테스트
db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
  } else {
    console.log('MySQL에 성공적으로 연결되었습니다.');
  }
});

// API 엔드포인트: user 테이블에서 데이터 가져오기
app.get('/users/:id', (req, res) => {
  const userId = req.params.id; // URL에서 사용자 ID를 가져옴

  const query = 'SELECT * FROM user WHERE u_id = ?'; // u_id가 일치하는 사용자 조회

  db.query(query, [userId], (error, results) => {
    if (error) {
        console.error("쿼리 실행 중 오류:", error);  // 에러 상세 로그 추가
        return res.status(500).json({ message: "Database query error", error: error.message });
    }
    if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
});
});

// 기본 경로에서 빌드된 index.html 파일 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/my-app/build/index.html"));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중..");
});