// src/pages/Calendar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Calendar.styled.css';
import { Bell, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import Calendar from 'react-calendar';
import back from '../assets/back_arrow.png';
import 'react-calendar/dist/Calendar.css';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarPage = ({ goBack }) => {
  const [medication, setMedication] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminders, setReminders] = useState([]);

  // 알림 권한 요청 로직
  useEffect(() => {
    if (Notification.permission === "denied") {
      console.log("Notification permission denied. Removing and re-requesting.");
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Permission status after request:", permission);
      });
    } else {
      console.log("Notification permission granted.");
    }
  }, []);

  // 로컬 스토리지에서 알림 목록 불러오기
  useEffect(() => {
    const savedReminders = localStorage.getItem('medicationReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders).map(reminder => ({
        ...reminder,
        date: reminder.date ? new Date(reminder.date) : null
      })));
    }
  }, []);

  // 알림 목록을 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('medicationReminders', JSON.stringify(reminders));
  }, [reminders]);

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/medicine-icon.png'
      });
      notification.onclick = () => window.focus();
    } else {
      console.log("Notification permission not granted.");
    }
  };

  const handleDaySelection = (dayIndex) => {
    setSelectedDays(selectedDays.includes(dayIndex) 
      ? selectedDays.filter(day => day !== dayIndex) 
      : [...selectedDays, dayIndex]
    );
  };

  const addReminder = () => {
    if (medication && time && (selectedDate || selectedDays.length > 0)) {
      const reminder = {
        medication,
        time,
        date: selectedDate,
        days: selectedDays,
        soundEnabled: true,
        notified: false, // 알림 발송 여부 초기화
        id: Date.now()
      };
  
      setReminders([...reminders, reminder]);
      setMedication('');
      setTime('');
      setSelectedDate(null);
      setSelectedDays([]);
      alert(`${medication} 알림이 설정되었습니다.`);
    }
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    alert("알림이 삭제되었습니다.");
  };

  const toggleSound = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, soundEnabled: !reminder.soundEnabled } : reminder
    ));
  };

  const checkReminders = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDay = now.getDay();
  
    setReminders(prevReminders => 
      prevReminders.map(reminder => {
        const reminderDate = new Date(reminder.date);
        const isSameDate = reminderDate.getDate() === now.getDate() &&
                           reminderDate.getMonth() === now.getMonth() &&
                           reminderDate.getFullYear() === now.getFullYear();
  
        // 알림이 아직 울리지 않았고, 조건에 부합할 때만 알림 발송
        if (!reminder.notified && (isSameDate || reminder.days.includes(currentDay)) && reminder.time <= currentTime) {
          showNotification("약 복용 시간", `${reminder.medication} 복용 시간입니다!`);
          return { ...reminder, notified: true }; // 알림 발송 여부를 true로 설정
        }
        return reminder;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="container">
      <div className="header">
        <Link to="/main"><img src={back} width='20px' alt="back"/></Link>
        <h1 className="title">알림</h1>
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
            <div key={index} className={`day ${selectedDays.includes(index) ? 'selected' : ''}`} onClick={() => handleDaySelection(index)}>
              {day}
            </div>
          ))}
        </div>
        <button onClick={addReminder} className="add-button">알림 추가</button>
      </div>

      <div className="reminders-list">
        <h2 className="reminders-title">등록된 알림</h2>
        {reminders.length === 0 ? (
          <p className="no-reminders">등록된 알림이 없습니다</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-details">
                <Bell size={16} className="bell-icon" />
                <span>{reminder.medication}</span>
                <span className="reminder-time">
                  {reminder.days.length === 7 ? '매일' : reminder.days.length > 0 ? reminder.days.map(dayIndex => DAYS[dayIndex]).join(', ') : reminder.date ? new Date(reminder.date).toLocaleDateString() : '매주'} {reminder.time}
                </span>
              </div>
              <button onClick={() => deleteReminder(reminder.id)} className="delete-button">삭제</button>
              <button onClick={() => toggleSound(reminder.id)} className="sound-button">
                {reminder.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;