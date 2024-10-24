// src/pages/TextSearch.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/TextSearch.styled.css';
import read from '../assets/reading_glasses.png';
import back from '../assets/back_arrow.png';

function TextSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState(['타이레놀']);
  
  // 검색어 입력 시 핸들러
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 버튼 클릭 시 핸들러
  const handleSearch = () => {
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches]); // 최근 검색어에 추가
    }
    setSearchTerm(''); // 입력 필드 초기화
  };

  return (
    <div className="text-search-page">
      <header className="search-header">
        {/* 메인 페이지로 돌아가기 버튼 */}
        <Link to="/"><img src={back} width='20px' alt="back"/></Link>
        <input 
          type="text" 
          placeholder="약 이름을 입력하세요." 
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button className="search-icon" onClick={handleSearch}>
          <img src={read} width='20px' alt="search"/>
        </button>
      </header>

      {/* 최근 검색된 약 */}
      <div className="recent-searches">
        <h2>최근에 검색하셨어요</h2>
        {recentSearches.map((item, index) => (
          <button key={index} className="recent-search">
            {item}
          </button>
        ))}
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