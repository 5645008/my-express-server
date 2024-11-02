// src/pages/SignUp.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/SignUp.styled.css';
import backIcon from '../assets/back_arrow.png';

function SignUp() {
  return (
    <div className="signup-container">
      {/* 상단에 뒤로가기 버튼 추가 */}
      <div className="signup-header">
        <Link to="/">
          <img src={backIcon} alt="뒤로가기" width="20px" />
        </Link>
      </div>

      <h2 className="signup-title">회원가입</h2>

      {/* 아이디 입력 */}
      <div className="form-group">
        <label>아이디</label>
        <input type="text" placeholder="아이디를 입력하세요" />
        <p className="error-message">아이디는 5~10자의 영소문자, 숫자만 입력 가능합니다.</p>
      </div>

      {/* 비밀번호 입력 */}
      <div className="form-group">
        <label>비밀번호</label>
        <input type="password" placeholder="비밀번호를 입력하세요" />
        <p className="error-message">비밀번호는 8~16자의 영소문자, 숫자, 특수문자만 입력 가능합니다.</p>
      </div>

      {/* 비밀번호 확인 입력 */}
      <div className="form-group">
        <label>비밀번호 확인</label>
        <input type="password" placeholder="비밀번호를 다시 입력하세요" />
      </div>

      {/* 연령 입력 */}
      <div className="form-group">
        <label>연령</label>
        <input type="number" placeholder="나이를 입력하세요" />
      </div>

      {/* 지병 입력 */}
      <div className="form-group">
        <label>지병</label>
        <input type="text" placeholder="지병을 입력하세요" />
      </div>

      {/* 성별 선택 */}
      <div className="form-group">
        <label>성별</label>
        <select>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>

      {/* 가입 버튼 */}
      <button className="signup-button">가입하기</button>
    </div>
  );
}

export default SignUp;