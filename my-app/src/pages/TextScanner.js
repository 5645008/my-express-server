import React, { useState } from 'react';
import axios from 'axios';

const TextScanner = ({ image }) => {
  const [text, setText] = useState(''); // 스캔된 텍스트
  const [medicines, setMedicines] = useState([]); // 매칭된 의약품 리스트
  const [error, setError] = useState(''); // 에러 메시지

  const scanText = async () => {
    try {
      // Google Vision API 호출
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=GOOGLE_CLOUD_VISION_API_KEY`, // API 키 설정
        {
          requests: [
            {
              image: {
                content: image.split(',')[1], // Base64 이미지 데이터
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }
      );

      const detectedText = response.data.responses[0]?.fullTextAnnotation?.text;
      if (detectedText) {
        setText(detectedText); // 스캔된 텍스트 저장
        searchMedicines(detectedText); // 매칭된 약 정보 검색
      } else {
        setError('텍스트를 감지하지 못했습니다.');
      }
    } catch (error) {
      setError('텍스트 스캔 중 오류가 발생했습니다.');
      console.error('Error scanning text:', error);
    }
  };

  const searchMedicines = async (detectedText) => {
    try {
      // 매칭된 의약품 검색 API 호출
      const response = await axios.post('https://moyak.store/api/medicine/search', { text: detectedText });
      setMedicines(response.data.matches || []); // 매칭 결과 저장
    } catch (error) {
      setError('매칭된 약 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching medicines:', error);
    }
  };

  return (
    <div>
      <button onClick={scanText}>Scan Text</button>
      {text && <p><strong>Detected Text:</strong> {text}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 매칭된 약 정보 */}
      {medicines.length > 0 ? (
        <div>
          <h3>매칭된 의약품 정보</h3>
          <ul>
            {medicines.map((medicine, index) => (
              <li key={index}>
                <p><strong>약 이름:</strong> {medicine.itemName}</p>
                <p><strong>효능:</strong> {medicine.efcyQesitm}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : text && !error ? (
        <p>매칭된 약 정보가 없습니다.</p>
      ) : null}
    </div>
  );
};

export default TextScanner;