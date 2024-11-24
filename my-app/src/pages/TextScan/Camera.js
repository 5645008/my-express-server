// TextScan/Camera.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
        videoConstraints={{
          facingMode: "environment", // 후면카메라 설정
        }}
      />
      <button onClick={captureImage}>Capture Image</button>
    </div>
  );
};

export default Camera;
