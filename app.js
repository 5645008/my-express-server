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
  origin: ['https://moyak.store', 'https://www.moyak.store', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

// 약 정보 상세 가져오기 API
app.get('/api/medicine/details', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: '약 이름이 필요합니다.' });
  }
  const query = `
    SELECT 
      entpName, 
      efcyQesitm, 
      useMethodQesitm, 
      atpnWarnQesitm, 
      atpnQesitm, 
      intrcQesitm, 
      seQesitm, 
      depositMethodQesitm, 
      ingredientName 
    FROM medicine 
    WHERE itemName = ? 
    LIMIT 1
  `;
  db.query(query, [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json(results[0]); // 상세 약 정보 반환
    } else {
      res.status(404).json({ error: '약 정보를 찾을 수 없습니다.' });
    }
  });
});

//텍스트스캔데이터매칭api
app.post('/api/medicine/scan-match', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '검색 텍스트가 필요합니다.' });
  }

  // 띄어쓰기로 텍스트 분리
  const words = text.split(' ').map(word => word.trim());

  // 데이터베이스 쿼리 작성
  const query = `
    SELECT entpName, itemName, efcyQesitm 
    FROM medicine 
    WHERE itemName = ?
  `;

  // 순서대로 단어를 하나씩 확인하며 쿼리 실행
  const results = [];
  const processWord = (index) => {
    if (index >= words.length) {
      // 모든 단어 처리 후 결과 반환
      if (results.length > 0) {
        res.json({ matches: results });
      } else {
        res.json({ matches: [], message: '매칭된 항목이 없습니다.' });
      }
      return;
    }
    db.query(query, [words[index]], (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database query error' });
      }
      // 매칭 결과 추가
      if (rows.length > 0) {
        results.push(...rows);
      }
      // 다음 단어 처리
      processWord(index + 1);
    });
  };
  processWord(0); // 첫 번째 단어부터 시작
});

app.get('/api/reminders', async (req, res) => {
  const user_id = req.query.user_id;
  console.log('user_id:', user_id); // 디버깅용 로그

  if (!user_id || typeof user_id !== 'string') {
    console.error('Invalid user_id');
    return res.status(400).json({ success: false, message: 'User ID is required and must be a string' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM user_reminders WHERE user_id = ?', [user_id]);
    console.log('Query result:', rows); // 쿼리 결과 확인

    if (rows.length === 0) {
      return res.json({ success: true, reminders: [] }); // 빈 배열 반환
    }

    res.json({ success: true, reminders: rows });
  } catch (error) {
    console.error('Database error:', error); // 에러 로그 추가
    res.status(500).json({ success: false, message: 'Error fetching reminders', error: error.message });
  }
});

app.post('/api/reminders', async (req, res) => {
  const { user_id, medication, reminder_time, reminder_date, days_of_week, sound_enabled } = req.body;

  // 1. 필수 필드 검증
  if (!user_id || !medication || !reminder_time) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: user_id, medication, and reminder_time are required' 
    });
  }

  // 2. 추가 데이터 검증
  if (reminder_date && isNaN(Date.parse(reminder_date))) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid date format for reminder_date' 
    });
  }
  if (days_of_week && typeof days_of_week !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'days_of_week must be a comma-separated string' 
    });
  }

  try {
    // 3. 데이터베이스 삽입
    const [result] = await db.query(
      'INSERT INTO user_reminders (user_id, medication, reminder_time, reminder_date, days_of_week, sound_enabled) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, medication, reminder_time, reminder_date || null, days_of_week || null, sound_enabled || true]
    );

    // 4. 성공적으로 삽입 완료
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error adding reminder:', error);
    res.status(500).json({ success: false, message: 'Error adding reminder', error: error.message });
  }
});

// 약물과 지병 상호작용 확인 API
app.get('/api/check-medication-safety', (req, res) => {
  const { user_id, medicine_name } = req.query;

  if (!user_id || !medicine_name) {
    return res.status(400).json({ error: 'user_id와 medicine_name이 필요합니다.' });
  }

  // 사용자 지병과 약품 금지 지병 가져오기
  const userDiseaseQuery = 'SELECT user_disease FROM user WHERE user_id = ?';
  const medicineDiseaseQuery = 'SELECT restrictedSymptoms FROM medicine WHERE itemName = ?';

  db.query(userDiseaseQuery, [user_id], (userErr, userResults) => {
    if (userErr) {
      console.error('사용자 지병 조회 오류:', userErr);
      return res.status(500).json({ error: '사용자 정보를 가져오는 중 오류가 발생했습니다.' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: '해당 사용자를 찾을 수 없습니다.' });
    }

    let userDiseases = [];
    if (userResults[0].user_disease) {
      try {
        userDiseases = JSON.parse(userResults[0].user_disease); // JSON 형식 파싱
      } catch (parseError) {
        console.error('지병 데이터 파싱 오류:', parseError);
        return res.status(500).json({ error: '사용자 지병 데이터가 올바르지 않습니다.' });
      }
    }

    db.query(medicineDiseaseQuery, [medicine_name], (medicineErr, medicineResults) => {
      if (medicineErr) {
        console.error('약품 금지 지병 조회 오류:', medicineErr);
        return res.status(500).json({ error: '약품 정보를 가져오는 중 오류가 발생했습니다.' });
      }

      if (medicineResults.length === 0) {
        return res.status(404).json({ error: '해당 약품을 찾을 수 없습니다.' });
      }

      const prohibitedDiseases = medicineResults[0].restrictedSymptoms
        ? medicineResults[0].restrictedSymptoms.split(',') // 금지 지병 문자열을 배열로 변환
        : [];

      // 지병 비교
      const riskyDiseases = userDiseases.filter(disease =>
        prohibitedDiseases.includes(disease)
      );

      if (riskyDiseases.length > 0) {
        return res.json({
          safe: false,
          message: `섭취 금지: ${riskyDiseases.join(', ')} 때문에 위험합니다.`,
        });
      } else {
        return res.json({ safe: true, message: '섭취 가능합니다.' });
      }
    });
  });
});

app.put('/api/reminders/:id', async (req, res) => {
  const { id } = req.params;
  const { medication, reminder_time, reminder_date, days_of_week, sound_enabled, notified } = req.body;

  try {
    await db.query(
      'UPDATE user_reminders SET medication = ?, reminder_time = ?, reminder_date = ?, days_of_week = ?, sound_enabled = ?, notified = ? WHERE id = ?',
      [medication, reminder_time, reminder_date, days_of_week, sound_enabled, notified, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating reminder' });
  }
});

app.delete('/api/reminders/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM user_reminders WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting reminder' });
  }
});



// React 정적 파일 제공
app.use(express.static(path.join(__dirname, "my-app/build")));

// 기본 경로에서 빌드된 index.html 파일 제공
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/my-app/build/index.html"));
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중..");
});