// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Calendar from './pages/Calendar';
import TextSearch from './pages/TextSearch';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Main />} />
        {/* 캘린더 페이지 */}
        <Route path="/calendar" element={<Calendar />} />
        {/* 텍스트 검색 페이지 */}
        <Route path="/search" element={<TextSearch />} />
      </Routes>
    </Router>
  );
}
//test
export default App;