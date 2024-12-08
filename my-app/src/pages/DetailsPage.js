import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import '../css/DetailsPage.styled.css';
import back from '../assets/back_arrow.png';

const DetailsPage = () => {
  const [details, setDetails] = useState(null);
  const [checkResult, setCheckResult] = useState(null); // API 결과 저장
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

  const handleCheckMedicine = async () => {
    const userId = localStorage.getItem('user_id'); // 로컬 스토리지에서 user_id 가져오기
    if (!userId) {
      alert('로그인 정보가 없습니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    try {
      const response = await axios.post('https://moyak.store/api/check-medicine', {
        user_id: userId,
        itemName: medicineName,
      });
      setCheckResult(response.data.message); // 결과 메시지를 저장
    } catch (error) {
      console.error('Error checking medicine compatibility:', error);
      setCheckResult('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (!medicineName) {
    return (
      <div className="details-page">
        <p className="loading-message">약 이름이 전달되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-header">
        <Link to="/main" className="back-button">
          <img src={back} alt="뒤로 가기" />
        </Link>
        <h1 className="details-title">{medicineName} 상세 정보</h1>
      </div>

      {details ? (
        <div className="details-container">
          <p className="details-item"><strong>제조사:</strong> {details.entpName}</p>
          <p className="details-item"><strong>효능:</strong> {details.efcyQesitm}</p>
          <p className="details-item"><strong>사용 방법:</strong> {details.useMethodQesitm}</p>
          <p className="details-item"><strong>주의 경고:</strong> {details.atpnWarnQesitm}</p>
          <p className="details-item"><strong>주의 사항:</strong> {details.atpnQesitm}</p>
          <p className="details-item"><strong>상호작용:</strong> {details.intrcQesitm}</p>
          <p className="details-item"><strong>부작용:</strong> {details.seQesitm}</p>
          <p className="details-item"><strong>보관 방법:</strong> {details.depositMethodQesitm}</p>
          <p className="details-item"><strong>성분:</strong> {details.ingredientName}</p>
        </div>
      ) : (
        <p className="loading-message">로딩 중...</p>
      )}

      <button onClick={handleCheckMedicine} className="check-button">
        나와 맞는지 체크하기
      </button>

      {checkResult && (
      <p
        className={`check-result ${
          checkResult.includes('복용해도 괜찮습니다') ? 'safe' : 'unsafe'
        }`}
      >
        {checkResult}
      </p>
    )}

    </div>
  );
};

export default DetailsPage;