// src/pages/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.styled.css';
import axios from 'axios';

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios.post("http://52.78.154.108:3000/login", {
      id,
      password,
    })
    .then((response) => {
      alert("로그인 성공!");
    })
    .catch((error) => {
      alert("로그인 실패: " + error.response.data.message);
    });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      {/* 아이디 입력 */}
      <div className="form-group">
        <label>아이디</label>
        <input type="text" placeholder="아이디를 입력하세요" />
      </div>

      {/* 비밀번호 입력 */}
      <div className="form-group">
        <label>비밀번호</label>
        <input type="password" placeholder="비밀번호를 입력하세요" />
      </div>

      {/* 로그인 버튼 */}
      <button className="login-button"><Link to="/main">로그인</Link></button>

      {/* 회원가입으로 이동하는 링크 */}
      <div className="signup-link">
        <p>새로운 이용자이신가요? <Link to="/signup">회원가입</Link></p>
      </div>
    </div>
  );
}

export default Login;