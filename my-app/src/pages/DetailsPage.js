import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
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
    return <p>약 이름이 전달되지 않았습니다.</p>;
  }

  return (
    <div>
      <Link to="/main"><img src={back} width="20px" alt="back" /></Link>
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
      <button onClick={handleCheckMedicine} className="check-button">
        나와 맞는지 체크하기
      </button>
      {checkResult && (
        <p className="check-result">
          {checkResult}
        </p>
      )}
    </div>
  );
};

export default DetailsPage;