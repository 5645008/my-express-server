// src/pages/Calendar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Calendar.styled.css';
import calendar from '../assets/calendar_image.png';
import back from '../assets/back_arrow.png';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // 현재 날짜에 따른 일수 계산
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // 해당 월의 마지막 날짜 계산
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    
    // 해당 월의 일 수 배열 생성
    const daysArray = Array.from({ length: lastDayOfMonth }, (_, i) => i + 1);
    setDaysInMonth(daysArray);
  }, [selectedDate]);

  // 날짜가 선택되었을 때의 핸들러
  const onDateClick = (day) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // 날짜를 "월 일 요일" 형식으로 한글로 변환
  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <Link to="/"><img src={back} width='20px'></img></Link> {/* 메인 페이지로 돌아가기 */}
        <h1>{formatDate(selectedDate)}</h1> {/* 선택된 날짜를 한글로 표시 */}
        <button className="calendar-icon"><img src={calendar} width='25px'></img></button>
      </header>

      {/* 간단한 캘린더 렌더링 */}
      <div className="calendar">
        <div className="days-header">
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>
        <div className="days-grid">
          {daysInMonth.map(day => (
            <div
              key={day}
              className={`day ${day === selectedDate.getDate() ? 'selected' : ''} ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() ? 'today' : ''}`}
              onClick={() => onDateClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* 알림표 */}
      <div className="notification-list">
        <h2>알림표</h2>
        <ul>
          <li>오전 10시 - 페니라민정</li>
          <li>오후 2시 - 암브로콜정</li>
          <li>오후 9시 - 프리비투스 현탁액</li>
        </ul>
      </div>
    </div>
  );
}

export default CalendarPage;