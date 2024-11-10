// ScanResult.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/ScanResult.styled.css';

const ScanResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Test.js에서 전달된 스캔된 텍스트와 간략한 정보를 받아옵니다.
  const { scannedText, summary } = location.state || { scannedText: "약 이름", summary: "간략한 정보가 여기에 표시됩니다." };
  
  const [isOpen, setIsOpen] = useState(false);

  const handleDetailsClick = () => {
    navigate('/details', { state: { text: scannedText } });
  };

  const toggleSlideUp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>스캔 결과</h2>
      <button 
        onClick={toggleSlideUp}
        style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        스캔 결과 보기
      </button>

      <div className={`slide-up-container ${isOpen ? 'open' : ''}`}>
        <h3>스캔된 텍스트: {scannedText}</h3>
        <p>간략한 정보: {summary}</p>
        <button 
          onClick={handleDetailsClick} 
          style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default ScanResult;