// src/pages/Main.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/Main.styled.css';
import camera from '../assets/camera.png';
import calendar from '../assets/calendar_image.png';
import glass from '../assets/reading_glasses.png';
import mypage from '../assets/mypage.png';

function Main() {
  const [today, setToday] = useState('');
  const [todayMedications, setTodayMedications] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setToday(formattedDate);

    const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    const todayReminders = savedReminders.filter((reminder) => {
      const reminderDate = reminder.reminder_date
        ? new Date(reminder.reminder_date).toDateString()
        : null;
      const isToday = reminderDate && reminderDate === currentDate.toDateString();
      const isRepeatDay =
        reminder.days_of_week &&
        reminder.days_of_week.split(',').includes(String(currentDate.getDay()));
      return isToday || isRepeatDay;
    });

    setTodayMedications(todayReminders.map((reminder) => reminder.medication));

    const fetchUserName = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        if (user_id) {
          const response = await axios.get('https://moyak.store/api/get-username', {
            params: { user_id },
          });

          if (response.data.success) {
            setUserName(response.data.user_name);
          } else {
            alert('사용자 이름을 찾을 수 없습니다.');
          }
        }
      } catch (error) {
        console.error('이름 불러오기 오류:', error);
        alert('이름을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="main">
      {/* 상단 사용자 정보 및 날짜 */}
      <div className="header">
        <span>{userName ? `${userName}님` : '사용자님'}</span>
        <span>{today}</span>
      </div>

      {/* 오늘의 약 정보 */}
      <div className="medication-card">
        <h2>오늘</h2>
        <div className="medication-list">
          {todayMedications.length > 0 ? (
            todayMedications.map((medication, index) => <p key={index}>{medication}</p>)
          ) : (
            <p>오늘 복용할 약이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 버튼 섹션 */}
      <div className="button-section">
        <Link to="/search">
          <button className="button-item">
            <img src={glass} alt="Search" className="button-icon" />
            <span>약 검색</span>
          </button>
        </Link>
        <Link to="/text-scan">
          <button className="button-item">
            <img src={camera} alt="Camera" className="button-icon" />
            <span>사진 검색</span>
          </button>
        </Link>
        <Link to="/calendar">
          <button className="button-item">
            <img src={calendar} alt="Calendar" className="button-icon" />
            <span>캘린더</span>
          </button>
        </Link>
        <Link to="/mypage">
          <button className="button-item">
            <img src={mypage} alt="Mypage" className="button-icon" />
            <span>마이페이지</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Main;