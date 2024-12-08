// src/pages/Mypage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Mypage.styled.css";
import axios from "axios";

function Mypage() {
  const [userInfo, setUserInfo] = useState({
    currentPassword: "",
    newPassword: "",
    userName: "",
    userAge: "",
    userDiseases: "", // 문자열 형태로 시작
    userGender: "",
  });
  const [showDiseaseOptions, setShowDiseaseOptions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const diseaseOptions = [
    "고혈압", "당뇨", "고지혈증", "소화성궤양", "역류성 식도질환",
    "과민성 대장증후군", "천식", "관절염", "통풍", "폐결핵",
    "간 기능 문제", "신장 질환", "심부전", "간질", "골다공증",
    "갑상선 기능 이상",
  ];

  useEffect(() => {
    // 로컬에 저장된 user_id를 가져옴
    const storedUserId = localStorage.getItem("user_id");
    if (!storedUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 사용자 정보 가져오기
    axios
      .get(`https://moyak.store/api/user-info?user_id=${storedUserId}`)
      .then((response) => {
        const userDiseases = response.data.user_disease || "";
        
        setUserInfo({
          currentPassword: "",
          newPassword: "",
          userName: response.data.user_name,
          userAge: response.data.user_age,
          userDiseases: userDiseases, // 문자열 그대로 저장
          userGender: response.data.user_gender,
        });
      })
      .catch((error) => {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setErrorMessage("사용자 정보를 가져오지 못했습니다.");
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiseaseChange = (disease) => {
    let updatedDiseases = userInfo.userDiseases.split(',').map(d => d.trim()); // 문자열을 배열로 변환
    if (updatedDiseases.includes(disease)) {
      // 질병이 이미 포함되어 있으면 제거
      updatedDiseases = updatedDiseases.filter(d => d !== disease);
    } else {
      // 질병이 없으면 추가
      updatedDiseases.push(disease);
    }
    // 배열을 다시 문자열로 변환하여 업데이트
    setUserInfo((prev) => ({
      ...prev,
      userDiseases: updatedDiseases.join(', '),
    }));
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        user_id: localStorage.getItem("user_id"),
        current_password: userInfo.currentPassword,
        new_password: userInfo.newPassword,
        user_name: userInfo.userName,
        user_age: parseInt(userInfo.userAge),
        user_disease: userInfo.userDiseases, // 문자열로 보냄
        user_gender: userInfo.userGender,
      };

      if (userInfo.currentPassword || userInfo.newPassword) {
        // 비밀번호만 수정
        const response = await axios.post("https://moyak.store/api/update-user-info", updateData);
        if (response.data.success) {
          alert("비밀번호가 변경되었습니다.");
        } else {
          setErrorMessage(response.data.message);
        }
      } else {
        // 비밀번호 없이 정보만 수정
        const response = await axios.post("https://moyak.store/api/update-user-info", {
          user_id: localStorage.getItem("user_id"),
          user_name: userInfo.userName,
          user_age: parseInt(userInfo.userAge),
          user_disease: userInfo.userDiseases, // 문자열로 보냄
          user_gender: userInfo.userGender,
        });
        if (response.data.success) {
          alert("정보가 성공적으로 업데이트되었습니다.");
        } else {
          setErrorMessage(response.data.message);
        }
      }
    } catch (error) {
      console.error("정보 업데이트 중 오류 발생:", error);
      setErrorMessage("정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      <div className="form-group">
        <label>현재 비밀번호</label>
        <input
          type="password"
          name="currentPassword"
          placeholder="현재 비밀번호를 입력하세요"
          value={userInfo.currentPassword}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>새 비밀번호</label>
        <input
          type="password"
          name="newPassword"
          placeholder="새 비밀번호를 입력하세요"
          value={userInfo.newPassword}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>이름</label>
        <input
          type="text"
          name="userName"
          placeholder="이름을 입력하세요"
          value={userInfo.userName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>나이</label>
        <input
          type="number"
          name="userAge"
          placeholder="나이를 입력하세요"
          value={userInfo.userAge}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>지병</label>
        <div
          className="disease-dropdown"
          onClick={() => setShowDiseaseOptions(!showDiseaseOptions)}
        >
          {userInfo.userDiseases.length > 0
            ? userInfo.userDiseases
            : "지병을 선택하세요"}
        </div>

        {showDiseaseOptions && (
          <div className="checkbox-group">
            {diseaseOptions.map((disease, index) => {
              const isChecked = userInfo.userDiseases.split(',').map(d => d.trim()).includes(disease);
              return (
                <div key={index} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`disease-${index}`}
                    value={disease}
                    checked={isChecked}  // user_disease에 포함된 경우 체크
                    onChange={() => handleDiseaseChange(disease)}
                  />
                  <label htmlFor={`disease-${index}`}>{disease}</label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>성별</label>
        <select
          name="userGender"
          value={userInfo.userGender}
          onChange={handleInputChange}
        >
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="mypage-button" onClick={handleUpdate}>
        변경하기
      </button>
    </div>
  );
}

export default Mypage;