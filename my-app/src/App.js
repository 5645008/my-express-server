// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import Calendar from './pages/Calendar';
import TextSearch from './pages/TextSearch';
import ScanResult from './pages/ScanResult'; // 스캔 결과 페이지
import DetailsPage from './pages/DetailsPage'; // 상세 설명 페이지
import Test from './pages/Test'; // 슬라이드 탭 테스트 페이지
import TextScanPage from './pages/TextScanPage'; // 텍스트 스캔 페이지 추가

function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<Login />} />
        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUp />} />
        {/* 메인 페이지 */}
        <Route path="/main" element={<Main />} />
        {/* 캘린더 페이지 */}
        <Route path="/calendar" element={<Calendar />} />
        {/* 텍스트 검색 페이지 */}
        <Route path="/search" element={<TextSearch />} />
        {/* 스캔 결과 페이지 */}
        <Route path="/scan-result" element={<ScanResult />} />
        {/* 상세 설명 페이지 */}
        <Route path="/details" element={<DetailsPage />} />
        {/* 슬라이드 탭 테스트 페이지 */}
        <Route path="/test" element={<Test />} />
        {/* 텍스트 스캔 페이지 */}
        <Route path="/text-scan" element={<TextScanPage />} />
      </Routes>
    </Router>
  );
}

export default App;