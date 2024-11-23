import React, { useState } from 'react';
import axios from 'axios';
import { GOOGLE_CLOUD_VISION_API_KEY } from './config';

const TextScanner = ({ image }) => {
  const [text, setText] = useState('');
  const [medicines, setMedicines] = useState([]); // 매칭된 의약품 리스트
  const [words, setWords] = useState([]); // 전처리된 단어 상태
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

      const detectedText = response.data.responses[0]?.fullTextAnnotation?.text || '';
      setText(detectedText);

      if (detectedText) {
        await searchMedicines(detectedText);
      }
    } catch (error) {
      console.error('Error scanning text:', error);
    }
  };

  const searchMedicines = async (detectedText) => {
    try {
      // 텍스트 전처리: 한글만 추출, 길이 2 이상인 단어만 필터링
      const words = detectedText
        .split(/\s+/) // 공백을 기준으로 단어 나누기
        .map(word => word.replace(/[^가-힣]/g, '').trim()) // 한글만 남기기
        .filter(word => word.length > 1); // 길이가 1 이상인 단어만 필터링

      console.log('전처리된 단어 목록:', words);
      setWords(words); // 전처리된 단어를 상태로 저장

      // 모든 단어에 대해 병렬로 API 호출
      const results = await Promise.all(
        words.map(async (word) => {
          try {
            console.log(`"${word}"에 대해 API 호출 중...`);
            const response = await axios.get('https://moyak.store/api/medicine', {
              params: { name: word },
            });
            return response.data; // 성공한 데이터 반환
          } catch (error) {
            console.log(`"${word}"에 대한 약 정보를 찾을 수 없습니다.`);
            return null; // 실패한 경우 null 반환
          }
        })
      );

      // 유효한 결과만 필터링
      const matchedMedicines = results.filter((medicine) => medicine !== null);
      setMedicines(matchedMedicines);

      if (matchedMedicines.length === 0) {
        console.log('매칭된 약 정보가 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  return (
    <div>
      <button onClick={scanText}>Scan Text</button>
      {text && <p><strong>Detected Text:</strong> {text}</p>}
      <h2>전처리된 단어 목록:</h2>
      <ul>
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ul>
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
        text && medicines.length === 0 && <p>매칭된 약 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default TextScanner;