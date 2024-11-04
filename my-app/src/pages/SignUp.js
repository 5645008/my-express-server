// src/pages/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.styled.css';
import backIcon from '../assets/back_arrow.png';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    user_id: '',
    user_password: '',
    confirmPassword: '', // 비밀번호 확인 필드 추가
    user_age: '',
    user_disease: '',
    user_gender: '1' // 기본값을 남성(1)으로 설정
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
      user_gender: selectedGender
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인 값이 일치하는지 검사
    if (formData.user_password !== formData.confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const { user_id, user_password, user_age, user_disease, user_gender } = formData;
      const response = await axios.post('http://52.78.154.108:3000/api/signup', { user_id, user_password, user_age, user_disease, user_gender });

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
      <div className="signup-header">
        <Link to="/">
          <img src={backIcon} alt="뒤로가기" width="20px" />
        </Link>
      </div>

      <h2 className="signup-title">회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input type="text" name="user_id" placeholder="아이디를 입력하세요" value={formData.user_id} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" name="user_password" placeholder="비밀번호를 입력하세요" value={formData.user_password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" placeholder="비밀번호를 다시 입력하세요" value={formData.confirmPassword} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>연령</label>
          <input type="number" name="user_age" placeholder="나이를 입력하세요" value={formData.user_age} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>지병</label>
          <input type="text" name="user_disease" placeholder="지병을 입력하세요" value={formData.user_disease} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>성별</label>
          <select name="user_gender" value={formData.user_gender} onChange={handleGenderChange}>
            <option value="1">남성</option>
            <option value="2">여성</option>
          </select>
        </div>

        <button type="submit" className="signup-button">가입하기</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}

export default SignUp;