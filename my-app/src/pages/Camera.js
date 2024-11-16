import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const videoConstraints = {
    facingMode: 'environment', // 모바일에서 후면 카메라 사용
    width: 1280,
    height: 720,
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      if (capturedImage) {
        setImage(capturedImage);
        onCapture(capturedImage); // 부모로 이미지 전달
      } else {
        console.error('Failed to capture image');
      }
    }
  };

  return (
    <div>
      <h2>Capture Image</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={captureImage}>Capture Image</button>
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default Camera;