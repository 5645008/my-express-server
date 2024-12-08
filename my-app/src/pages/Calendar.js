import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Calendar.styled.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import back from '../assets/back_arrow.png';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarPage = () => {
  const [medication, setMedication] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const storedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    setReminders(storedReminders);
  }, []);

  const addReminder = () => {
    if (!medication || !time || (!selectedDate && selectedDays.length === 0)) {
      alert('약 이름, 시간, 날짜 또는 요일을 설정하세요.');
      return;
    }

    const newReminder = {
      medication,
      reminder_time: time,
      reminder_date: selectedDate,
      days_of_week: selectedDays.join(','), 
      sound_enabled: true,
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));

    alert(`${medication} 알림이 추가되었습니다.`);
    setMedication('');
    setTime('');
    setSelectedDate(null);
    setSelectedDays([]);
  };

  const deleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    alert('알림이 삭제되었습니다.');
  };

  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay();

    reminders.forEach((reminder) => {
      const [reminderHour, reminderMinute] = reminder.reminder_time.split(':').map(Number);
      const isToday = reminder.reminder_date && new Date(reminder.reminder_date).toDateString() === now.toDateString();
      const isRepeatDay = reminder.days_of_week && reminder.days_of_week.split(',').includes(String(currentDay));
      const isExactTime = currentHour === reminderHour && currentMinute === reminderMinute;

      if ((isToday || isRepeatDay) && isExactTime) {
        alert(`${reminder.medication} 복용 시간입니다!`);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="container">
      <div className="header">
        <div className="back-container">
          <Link to="/main">
            <img src={back} width="20px" alt="뒤로 가기" />
          </Link>
        </div>
        <div className="title-container">
          <h1 className="title">알림</h1>
        </div>
      </div>

      <div className="reminder-form">
        <input
          type="text"
          placeholder="약 이름을 입력하세요"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          className="input"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">캘린더에서 날짜 선택</label>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="calendar"
          />
        </div>
        <div className="weekday-selection">
          {DAYS.map((day, index) => (
            <div
              key={index}
              className={`day ${selectedDays.includes(index) ? 'selected' : ''}`}
              onClick={() =>
                setSelectedDays(
                  selectedDays.includes(index)
                    ? selectedDays.filter((d) => d !== index)
                    : [...selectedDays, index]
                )
              }
            >
              {day}
            </div>
          ))}
        </div>
        <button onClick={addReminder} className="add-button">
          알림 추가
        </button>
      </div>

      <div className="reminders-list">
        <h2 className="reminders-title">등록된 알림</h2>
        {reminders.length === 0 ? (
          <p className="no-reminders">등록된 알림이 없습니다</p>
        ) : (
          reminders.map((reminder, index) => (
            <div key={index} className="reminder-item">
              <div className="reminder-details">
                <span>{reminder.medication}</span>
                <span className="reminder-time">
                  {reminder.days_of_week
                    ? reminder.days_of_week.split(',').map((d) => DAYS[parseInt(d)]).join(', ')
                    : new Date(reminder.reminder_date).toLocaleDateString()}{' '}
                  {reminder.reminder_time}
                </span>
              </div>
              <button onClick={() => deleteReminder(index)} className="delete-button">
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;