import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const captureImage = () => {
    console.log('Capture button clicked');
    
    // webcamRef가 초기화되었는지 확인
    if (webcamRef.current && webcamRef.current.getScreenshot) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        console.log('Captured Image:', imageSrc);
        onCapture(imageSrc);
      } else {
        console.error('Failed to capture image. Screenshot method returned null.');
      }
    } else {
      console.error('WebcamRef is not ready or getScreenshot method is not available.');
    }
  };

  // webcamRef가 초기화되었는지 확인하는 useEffect 추가
  useEffect(() => {
    if (webcamRef.current) {
      setIsReady(true); // Webcam이 초기화되면 준비 상태로 설정
    } else {
      setIsReady(false); // webcamRef가 초기화되지 않았으면 준비되지 않음
    }
  }, [webcamRef.current]);

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
      />
      <button onClick={captureImage} disabled={!isReady}>
        {isReady ? 'Capture Image' : 'Initializing...'}
      </button>
    </div>
  );
};

export default Camera;