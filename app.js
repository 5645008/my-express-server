const fs = require("fs");
const https = require("https");
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require("body-parser");
const session = require('express-session');

const app = express();

// CORS 설정 (HTTPS에서만 요청을 허용)
app.use(cors({
  origin: ['https://moyak.store', 'https://www.moyak.store'],
  methods: ['GET', 'POST'],
  credentials: true,   // 쿠키 포함 요청 허용
}));

app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true,   // HTTPS에서만 작동
    sameSite: 'None',
  }
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL 연결 풀 설정
const db = mysql.createPool({
  host: '52.78.154.108',
  port: '3306',
  user: 'user',
  password: '0000',
  database: 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 인증서 파일 경로
const privateKey = fs.readFileSync('/etc/letsencrypt/live/moyak.store/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/moyak.store/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/moyak.store/chain.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: ca };

// HTTPS 서버 실행
https.createServer(credentials, app).listen(443, () => {
  console.log('HTTPS 서버가 443번 포트에서 실행 중...');
});

// HTTP 요청을 HTTPS로 리다이렉션
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log('HTTP 요청을 HTTPS로 리다이렉션 중...');
});

// React 정적 파일 제공
app.use(express.static(path.join(__dirname, "my-app/build")));

// MySQL 연결 테스트
db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
  } else {
    console.log('MySQL에 성공적으로 연결되었습니다.');
  }
});

// 회원가입 API
app.post('/api/signup', (req, res) => {
  const { user_id, user_password, user_age, user_disease, user_gender } = req.body;

  const query = 'INSERT INTO user (user_id, user_password, user_age, user_disease, user_gender) VALUES (?, ?, ?, ?, ?)';
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
app.post('/api/login', (req, res) => {
  const { user_id, user_password } = req.body;

  const query = 'SELECT * FROM user WHERE user_id = ? AND user_password = ?';
  db.query(query, [user_id, user_password], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: '로그인 실패' });
      if (results.length > 0) {
        res.json({ success: true, message: '로그인 성공', user_id: results[0].user_id });
      } else {
          res.json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
  });
});

// main화면 이름 가져오는 API
app.get('/api/get-username', (req, res) => {
  const { user_id } = req.query;

  const query = 'SELECT user_name FROM user WHERE user_id = ?';
  db.query(query, [user_id], (err, results) => {
    if (err) {
      res.status(500).send('서버 오류');
    } else {
      if (results.length > 0) {
        res.json({ success: true, user_name: results[0].user_name });
      } else {
        res.json({ success: false, message: '사용자 이름을 찾을 수 없습니다.' });
      }
    }
  });
});

// 검색 예측 API
app.get('/api/search', (req, res) => {
  const searchTerm = req.query.term;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const query = `SELECT itemName FROM medicine WHERE itemName LIKE ? LIMIT 10`;
  db.query(query, [`%${searchTerm}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results.map(row => row.itemName));
  });
});

// 약 정보 가져오기 API
app.get('/api/medicine', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: '약 이름이 필요합니다.' });
  }

  const query = `SELECT itemName, efcyQesitm FROM medicine WHERE itemName = ? LIMIT 1`;
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length > 0) {
      res.json(results[0]); // 약의 정보 반환
    } else {
      res.status(404).json({ error: '약 정보를 찾을 수 없습니다.' });
    }
  });
});

//텍스트스캔데이터매칭api
app.post('/api/medicine/search', (req, res) => {
  const { text } = req.body; // 클라이언트에서 보낸 텍스트
  if (!text) {
    return res.status(400).json({ error: '검색 텍스트가 필요합니다.' });
  }

  // 띄어쓰기 단위로 텍스트 분리
  const words = text.split(' ');

  // 데이터베이스에서 매칭된 약 정보 검색
  const query = `
    SELECT entpName, itemName, efcyQesitm 
    FROM medicine 
    WHERE itemName IN (?)
  `;
  db.query(query, [words], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length > 0) {
      res.json({ matches: results }); // 매칭된 결과 반환
    } else {
      res.json({ matches: [], message: '매칭된 항목이 없습니다.' });
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