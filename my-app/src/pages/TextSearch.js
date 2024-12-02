import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/TextSearch.styled.css';
import read from '../assets/reading_glasses.png';
import back from '../assets/back_arrow.png';

function TextSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // 선택된 약 정보
  const [showInfoBox, setShowInfoBox] = useState(false); // 하단 정보 박스 표시 여부

  const navigate = useNavigate(); // 페이지 이동 함수

  // 검색어 입력 시 핸들러
  const handleInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term) {
      try {
        const response = await axios.get(`https://moyak.store/api/search?term=${term}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 검색 버튼 클릭 시 핸들러
  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await axios.get(`https://moyak.store/api/medicine?name=${searchTerm}`);
      setSelectedMedicine(response.data); // 선택된 약 정보 설정
      setShowInfoBox(true); // 정보 박스 표시
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    }

    // 최근 검색어 추가 (최대 5개 유지)
    setRecentSearches((prevSearches) => {
      const updatedSearches = [searchTerm, ...prevSearches];
      if (updatedSearches.length > 5) {
        updatedSearches.pop(); // 오래된 검색어 제거
      }
      return updatedSearches;
    });

    setSearchTerm('');
    setSuggestions([]);
  };

  // "자세히 보기" 버튼 클릭 시 DetailsPage로 이동
  const handleDetails = (medicineName) => {
    navigate('/details', { state: { medicineName } }); // 약 이름 전달하며 페이지 이동
  };

  return (
    <div className="text-search-page">
      <header className="search-header">
        <Link to="/main"><img src={back} width="20px" alt="back" /></Link>
        <input
          type="text"
          placeholder="약 이름을 입력하세요."
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="search-icon" onClick={handleSearch}>
          <img src={read} width="20px" alt="search" />
        </button>
      </header>

      {/* 검색 예측 결과 */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => {
                setSearchTerm(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* 하단 정보 박스 */}
      {selectedMedicine && (
        <div className={`medicine-info-box ${showInfoBox ? 'visible' : ''}`}>
          <h3>{selectedMedicine.itemName}</h3>
          <p>{selectedMedicine.efcyQesitm}</p>
          <button className="details-button" onClick={() => handleDetails(selectedMedicine.itemName)}>상세 정보 보기</button> {/* 추가된 버튼 */}
        </div>
      )}

      {/* 최근 검색된 약 */}
      <div className="recent-searches">
        <h2>최근에 검색하셨어요</h2>
        {recentSearches.length > 0 ? (
          recentSearches.map((item, index) => (
            <button key={index} className="recent-search">
              {item}
            </button>
          ))
        ) : (
          <p>최근 검색 내역이 없습니다.</p>
        )}
      </div>

      {/* 인기 검색어 */}
      <div className="popular-searches">
        <h2>인기 있는 검색어예요</h2>
        <ol>
          <li>비타민 C</li>
          <li>타이레놀</li>
          <li>판피린</li>
        </ol>
      </div>
    </div>
  );
}

export default TextSearch;