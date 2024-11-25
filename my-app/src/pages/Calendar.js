import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Calendar.styled.css';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import Calendar from 'react-calendar';
import axios from 'axios';
import back from '../assets/back_arrow.png';
import 'react-calendar/dist/Calendar.css';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const CalendarPage = ({ userId }) => {
  const [medication, setMedication] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminders, setReminders] = useState([]);

  // 알림 권한 요청
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 사용자별 알림 데이터 불러오기
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(`/api/reminders?user_id=${userId}`);
        setReminders(response.data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    fetchReminders();
  }, [userId]);

  // 알림 추가
  const addReminder = async () => {
    if (!medication || !time || (!selectedDate && selectedDays.length === 0)) {
      alert('약 이름, 시간, 날짜 또는 요일을 설정하세요.');
      return;
    }

    const reminder = {
      user_id: userId,
      medication,
      reminder_time: time,
      reminder_date: selectedDate,
      days_of_week: selectedDays.join(','), // 요일을 CSV로 저장
      sound_enabled: true,
    };

    try {
      const response = await axios.post('/api/reminders', reminder);
      setReminders([...reminders, { ...reminder, id: response.data.id }]);
      alert(`${medication} 알림이 추가되었습니다.`);
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('알림 추가에 실패했습니다.');
    }

    // 입력 필드 초기화
    setMedication('');
    setTime('');
    setSelectedDate(null);
    setSelectedDays([]);
  };

  // 알림 삭제
  const deleteReminder = async (id) => {
    try {
      await axios.delete(`/api/reminders/${id}`);
      setReminders(reminders.filter((reminder) => reminder.id !== id));
      alert('알림이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('알림 삭제에 실패했습니다.');
    }
  };

  // 알림 소리 설정 토글
  const toggleSound = async (id) => {
    const reminder = reminders.find((reminder) => reminder.id === id);
    if (!reminder) return;

    const updatedReminder = { ...reminder, sound_enabled: !reminder.sound_enabled };

    try {
      await axios.put(`/api/reminders/${id}`, updatedReminder);
      setReminders(
        reminders.map((r) => (r.id === id ? { ...r, sound_enabled: updatedReminder.sound_enabled } : r))
      );
    } catch (error) {
      console.error('Error toggling sound:', error);
      alert('알림 소리 설정 변경에 실패했습니다.');
    }
  };

  // 알림 확인 및 발송
  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours(); // 현재 시간 (Hour)
    const currentMinute = now.getMinutes(); // 현재 분 (Minute)
    const currentDay = now.getDay(); // 현재 요일 (0: 일요일 ~ 6: 토요일)
  
    reminders.forEach(async (reminder) => {
      const [reminderHour, reminderMinute] = reminder.reminder_time.split(':').map(Number); // 알림의 Hour와 Minute
  
      const isToday =
        reminder.reminder_date && new Date(reminder.reminder_date).toDateString() === now.toDateString();
      const isRepeatDay = reminder.days_of_week && reminder.days_of_week.split(',').includes(String(currentDay));
  
      // 시간(Hour)와 분(Minute)을 정확히 비교
      const isExactTime = currentHour === reminderHour && currentMinute === reminderMinute;
  
      if ((isToday || isRepeatDay) && isExactTime && !reminder.notified) {
        // 알림 조건이 만족되면 알림 표시
        if (Notification.permission === 'granted') {
          new Notification('약 복용 알림', { body: `${reminder.medication} 복용 시간입니다.` });
        }
  
        // 알림 발송 여부를 true로 업데이트
        try {
          await axios.put(`/api/reminders/${reminder.id}`, { ...reminder, notified: true });
          setReminders(reminders.map((r) => (r.id === reminder.id ? { ...r, notified: true } : r)));
        } catch (error) {
          console.error('Error updating notification status:', error);
        }
      }
    });
  };  

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000); // 1분마다 확인
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="container">
      <div className="header">
        <Link to="/main">
          <img src={back} width="20px" alt="back" />
        </Link>
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
          reminders.map((reminder) => (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-details">
                <Bell size={16} className="bell-icon" />
                <span>{reminder.medication}</span>
                <span className="reminder-time">
                  {reminder.days_of_week
                    ? reminder.days_of_week.split(',').map((d) => DAYS[parseInt(d)]).join(', ')
                    : new Date(reminder.reminder_date).toLocaleDateString()}{' '}
                  {reminder.reminder_time}
                </span>
              </div>
              <button onClick={() => deleteReminder(reminder.id)} className="delete-button">
                삭제
              </button>
              <button onClick={() => toggleSound(reminder.id)} className="sound-button">
                {reminder.sound_enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;