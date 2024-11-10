// Test.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Test.css';
const Test = () => {
  const navigate = useNavigate();

  // 스캔 결과를 테스트하기 위해 임의의 텍스트 데이터 설정
  const mockScannedText = "파라세타몰";
  const mockSummary = "파라세타몰은 통증과 열을 완화하는 데 사용됩니다.";

  // ScanResult 페이지로 이동하면서 스캔된 텍스트 데이터를 전달
  const handleScanTest = () => {
    navigate('/scan-result', { state: { scannedText: mockScannedText, summary: mockSummary } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>스캔 테스트 페이지</h2>
      <button 
        onClick={handleScanTest}
        style={{ marginTop: '20px', padding: '10px', fontSize: '16px', cursor: 'pointer' }}
      >
        스캔 결과 보기 테스트
      </button>
    </div>
  );
};

export default Test;