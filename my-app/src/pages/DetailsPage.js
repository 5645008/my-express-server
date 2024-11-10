// DetailsPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const DetailsPage = () => {
  const location = useLocation();
  const { text } = location.state || { text: "약 이름" };
  const detailedInfo = `상세 설명: ${text}은(는) 주로 통증 완화에 사용되며, 사용 시 주의 사항이 필요합니다.`;

  return (
    <div style={{ padding: '20px' }}>
      <h2>상세 설명</h2>
      <p>{detailedInfo}</p>
    </div>
  );
};

export default DetailsPage;