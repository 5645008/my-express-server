// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.styled.css';
import axios from 'axios';

function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 로그인 성공 시 페이지 이동을 위한 네비게이트 훅

  const handleLogin = () => {
    axios.post("http://52.78.154.108:3000/api/login", {
      id,
      password,
    })
    .then((response) => {
      if (response.data.success) {
        alert("로그인 성공!");
        navigate("/main"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        alert("로그인 실패: " + response.data.message);
      }
    })
    .catch((error) => {
      alert("로그인 실패: " + (error.response?.data?.message || "오류가 발생했습니다."));
    });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">로그인</h2>

      {/* 아이디 입력 */}
      <div className="form-group">
        <label>아이디</label>
        <input 
          type="text" 
          placeholder="아이디를 입력하세요" 
          value={id}
          onChange={(e) => setId(e.target.value)} // 상태 업데이트
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="form-group">
        <label>비밀번호</label>
        <input 
          type="password" 
          placeholder="비밀번호를 입력하세요" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
        />
      </div>

      {/* 로그인 버튼 */}
      <button className="login-button" onClick={handleLogin}>로그인</button>

      {/* 회원가입으로 이동하는 링크 */}
      <div className="signup-link">
        <p>새로운 이용자이신가요? <Link to="/signup">회원가입</Link></p>
      </div>
    </div>
  );
}

export default Login;