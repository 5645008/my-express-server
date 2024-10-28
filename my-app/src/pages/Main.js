// src/pages/Main.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/Main.styled.css';
import camera from '../assets/camera.png';
import calendar from '../assets/calendar_image.png';
import glass from '../assets/reading_glasses.png';

function Main() {
  const [today, setToday] = useState('');
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태 추가
  const [error, setError] = useState(''); // 오류 상태 추가

  const handleButtonClick = () => {
    console.log('버튼 클릭됨'); // 로그 추가
    axios.get('http://52.78.154.108:3000/users/asdf')
      .then((response) => {
        console.log('데이터 수신:', response.data); // 로그 추가
        setUserData(response.data); // 받아온 데이터 저장
      })
      .catch((error) => {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
      });
  };
  
  // 오류 메시지 출력
  {error && <p className="error-message">{error}</p>}

  // 현재 날짜를 가져와서 YYYY-MM-DD 형식으로 설정
  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setToday(formattedDate);
  }, []);

  return (
    <div className="main">
      {/* 상단 사용자 정보 및 날짜 */}
      <div className="header">
        <span>홍길동 님</span>
        <span>{today}</span> {/* 오늘 날짜를 표시 */}
        {/* 캘린더 아이콘을 클릭하면 캘린더 페이지로 이동 */}
        <Link to="/calendar">
          <button className="calendar-button">
            <span className="calendar-icon"><img src={calendar} width='30px'/></span>
          </button>
        </Link>
      </div>

      {/* DB 테스트용 버튼 */}
      <button onClick={handleButtonClick}>DB에서 데이터 가져오기</button>

      {/* 서버에서 받아온 데이터 출력 */}
      {userData && (
        <div>
          <h3>데이터 결과</h3>
          <p>아이디: {userData.u_id}</p>
          <p>비밀번호: {userData.u_password}</p>
          <p>이름: {userData.u_name}</p>
          <p>나이: {userData.u_age}</p>
        </div>
      )}

      {/* 오늘의 약 정보 */}
      <div className="medication-card">
        <h2>오늘</h2>
        <div className="medication-list">
          <p>페니라민정</p>
          <p>암브로콜정</p>
          <p>프리비투스 현탁액</p>
        </div>
      </div>

      {/* 검색 버튼 섹션 */}
      <div className="button-section">
        {/* 약 검색 버튼 */}
        <Link to="/search">
          <button className="search-button">
            <span className="search-icon"><img src={glass} width='50px'/></span>
            <span>약 검색</span> {/* 아이콘 아래 텍스트 출력 */}
          </button>
        </Link>

        {/* 사진 검색 버튼 */}
        <button className="camera-button">
          <span className="camera-icon"><img src={camera} width='50px'/></span>
          <span>사진 검색</span> {/* 아이콘 아래 텍스트 출력 */}
        </button>
      </div>
    </div>
  );
}

export default Main;