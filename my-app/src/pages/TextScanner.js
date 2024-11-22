import React, { useState } from 'react';
import axios from 'axios';
import { GOOGLE_CLOUD_VISION_API_KEY } from './config';

const TextScanner = ({ image }) => {
  const [text, setText] = useState('');
  const [medicines, setMedicines] = useState([]); // 매칭된 의약품 리스트

  const scanText = async () => {
    try {
      // Google Vision API 호출
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: image.split(',')[1],
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

      const detectedText = response.data.responses[0].fullTextAnnotation.text;
      setText(detectedText);

      // 매칭된 의약품 검색
      searchMedicines(detectedText);
    } catch (error) {
      console.error('Error scanning text:', error);
    }
  };

  const searchMedicines = async (text) => {
    try {
      // 텍스트를 API에 전달
      const response = await axios.post('https://moyak.store/api/medicine/search', { text });
      
      if (response.data.matches && response.data.matches.length > 0) {
        setMedicines(response.data.matches); // 매칭된 결과 저장
      } else {
        console.log(response.data.message || '매칭된 항목이 없습니다.');
        setMedicines([]);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  return (
    <div>
      <button onClick={scanText}>Scan Text</button>
      {text && <p><strong>Detected Text:</strong> {text}</p>}
  
      {/* 매칭된 약 정보 표시 */}
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
      ) : (
        text && <p>매칭된 약 정보가 없습니다.</p> // 스캔된 텍스트가 있을 때만 출력
      )}
    </div>
  );
};

export default TextScanner;