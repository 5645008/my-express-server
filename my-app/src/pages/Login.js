// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.styled.css';
import axios from 'axios';

function Login() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://52.78.154.108:3000/api/login', {
        user_id: userId,
        user_password: userPassword,
      });

      if (response.data.success) {
        alert(response.data.message); // 로그인 성공 메시지
        navigate('/'); // 홈 페이지로 이동
      } else {
        setErrorMessage(response.data.message); // 로그인 실패 메시지 설정
      }
    } catch (error) {
      setErrorMessage('서버와의 통신에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      <div className="form-group">
        <label>아이디</label>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="login-button" onClick={handleLogin}>
        로그인
      </button>

      <div className="signup-link">
        <p>새로운 이용자이신가요? <Link to="/signup">회원가입</Link></p>
      </div>
    </div>
  );
}

export default Login;