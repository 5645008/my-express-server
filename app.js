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


// 회원가입 API
app.post('/api/signup', (req, res) => {
  const { user_id, user_password, user_age, user_disease, user_gender } = req.body;

  const query = 'INSERT INTO user (u_id, password, age, disease, user_gender) VALUES (?, ?, ?, ?, ?)';
  const values = [user_id, user_password, user_age, user_disease, user_gender];

  db.query(query, values, (error, results) => {
      if (error) {
          console.error("회원가입 중 오류 발생:", error);
          return res.status(500).json({ success: false, message: "회원가입 중 오류가 발생했습니다." });
      }
      res.json({ success: true, message: "회원가입 성공" });
  });
});

// 로그인 API
app.post('/login', (req, res) => {
  const { user_id, user_password } = req.body;
  const query = 'SELECT * FROM user WHERE u_id = ? AND password = ?';
  db.query(query, [user_id, user_password], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: '로그인 실패' });
      if (results.length > 0) {
          res.json({ success: true, message: '로그인 성공' });
      } else {
          res.json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
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