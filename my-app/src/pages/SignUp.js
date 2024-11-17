// src/pages/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.styled.css';
import backIcon from '../assets/back_arrow.png';
import axios from 'axios';

function SignUp() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userDiseases, setUserDiseases] = useState([]);
  const [showDiseaseOptions, setShowDiseaseOptions] = useState(false); // 지병 목록 표시 상태
  const [userGender, setUserGender] = useState('male');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const diseaseOptions = [
    "고혈압", "당뇨", "고지혈증", "소화성궤양", "역류성 식도질환",
    "과민성 대장증후군", "천식", "관절염", "통풍", "폐결핵",
    "간 기능 문제", "신장 질환", "심부전", "간질", "골다공증",
    "갑상선 기능 이상"
  ];

  const handleDiseaseChange = (disease) => {
    setUserDiseases((prevDiseases) => 
      prevDiseases.includes(disease) 
        ? prevDiseases.filter((d) => d !== disease) 
        : [...prevDiseases, disease]
    );
  };

  const handleSignUp = async () => {
    if (userPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    try {
      const response = await axios.post('https://moyak.store/api/signup', {
        user_id: userId,
        user_password: userPassword,
        user_age: parseInt(userAge), // 나이를 int 형식으로 변환
        user_disease: userDiseases,
        user_gender: userGender,
      });
  
      if (response.data.success) {
        alert(response.data.message);
        navigate('/login');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage('서버와의 통신에 문제가 발생했습니다.');
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

      <div className="form-group">
        <label>아이디</label>
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <p className="error-message">아이디는 5~10자의 영소문자, 숫자만 입력 가능합니다.</p>
      </div>

      <div className="form-group">
        <label>비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
        />
        <p className="error-message">비밀번호는 8~16자의 영소문자, 숫자, 특수문자만 입력 가능합니다.</p>
      </div>

      <div className="form-group">
        <label>비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>이름</label>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>나이</label>
        <input
          type="number"
          placeholder="나이를 입력하세요"
          value={userAge}
          onChange={(e) => setUserAge(e.target.value)}
        />
      </div>

      {/* 지병 선택 */}
      <div className="form-group">
        <label>지병</label>
        <div
          className="disease-dropdown"
          onClick={() => setShowDiseaseOptions(!showDiseaseOptions)}
        >
          {userDiseases.length > 0 ? userDiseases.join(', ') : '지병을 선택하세요'}
        </div>

        {showDiseaseOptions && (
          <div className="checkbox-group">
            {diseaseOptions.map((disease, index) => (
              <div key={index} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`disease-${index}`}
                  value={disease}
                  checked={userDiseases.includes(disease)}
                  onChange={() => handleDiseaseChange(disease)}
                />
                <label htmlFor={`disease-${index}`}>{disease}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>성별</label>
        <select value={userGender} onChange={(e) => setUserGender(e.target.value)}>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="signup-button" onClick={handleSignUp}>
        가입하기
      </button>
    </div>
  );
}

export default SignUp;