import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import '../../css/Camera.styled.css';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div className="camera-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        videoConstraints={{
          facingMode: "environment", // 후면카메라 설정
        }}
        className="webcam"
      />
      <button onClick={captureImage} className="camera-button" />
    </div>
  );
};

export default Camera;