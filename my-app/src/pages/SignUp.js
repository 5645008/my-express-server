// src/pages/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.styled.css';
import backIcon from '../assets/back_arrow.png';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    u_id: '',
    password: '',
    confirmPassword: '', // 비밀번호 확인 필드 추가
    age: '',
    disease: '',
    gender: '1' // 기본값을 남성(1)으로 설정
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value === 'male' ? '1' : '2';
    setFormData({
      ...formData,
      gender: selectedGender
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인 값이 일치하는지 검사
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { u_id, password, age, disease, gender } = formData;
      const response = await axios.post('http://52.78.154.108:3000/api/signup', { u_id, password, age, disease, gender });

      if (response.data.success) {
        alert('회원가입 성공');
        navigate('/login');
      } else {
        setErrorMessage('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setErrorMessage('회원가입 중 오류가 발생했습니다.');
    }
  };
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