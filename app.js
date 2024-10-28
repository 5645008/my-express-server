const express = require("express");
const path = require("path");
const mysql = require("mysql2");  // MySQL 모듈 불러오기

const app = express();
app.use(express.json());  // JSON 요청을 처리할 수 있도록 설정

// 포트 설정 (3000번 포트를 기본값으로 사용)
app.set("port", process.env.PORT || 3000);

// 빌드된 React 정적 파일 제공
app.use(express.static(path.join(__dirname, "my-app/build")));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',           // EC2 서버에서 MySQL이 실행 중인 경우 'localhost'
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
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: '데이터를 가져오는데 실패했습니다.' });
    } else {
      res.json(results);
    }
  });
});

// 기본 경로에서 빌드된 index.html 파일 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/my-app/build/index.html"));
});

// 서버 실행
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중..");
});