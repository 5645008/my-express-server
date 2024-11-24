import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../css/DetailsPage.css';

const DetailsPage = () => {
  const [details, setDetails] = useState(null);
  const location = useLocation();
  const { medicineName } = location.state || {}; // 약 이름 추출

  useEffect(() => {
    if (medicineName) {
      fetchMedicineDetails(medicineName);
    }
  }, [medicineName]);

  const fetchMedicineDetails = async (name) => {
    try {
      const response = await axios.get('https://moyak.store/api/medicine/details', {
        params: { name },
      });
      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    }
  };

  if (!medicineName) {
    return <p>약 이름이 전달되지 않았습니다.</p>;
  }

  return (
    <div>
      <h1>{medicineName} 상세 정보</h1>
      {details ? (
        <div>
          <p><strong>제조사:</strong> {details.entpName}</p>
          <p><strong>효능:</strong> {details.efcyQesitm}</p>
          <p><strong>사용 방법:</strong> {details.useMethodQesitm}</p>
          <p><strong>주의 경고:</strong> {details.atpnWarnQesitm}</p>
          <p><strong>주의 사항:</strong> {details.atpnQesitm}</p>
          <p><strong>상호작용:</strong> {details.intrcQesitm}</p>
          <p><strong>부작용:</strong> {details.seQesitm}</p>
          <p><strong>보관 방법:</strong> {details.depositMethodQesitm}</p>
          <p><strong>성분:</strong> {details.ingredientName}</p>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default DetailsPage;