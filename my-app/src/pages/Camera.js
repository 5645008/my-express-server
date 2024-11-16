// components/Camera.js
import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const captureImage = () => {
    console.log('Capture button clicked');
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      console.log('Captured Image:', imageSrc);
      onCapture(imageSrc);
    } else {
      console.error('Failed to capture image. webcamRef is null or not ready.');
    }
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={300}
      />
      <button onClick={captureImage}>Capture Image</button>
    </div>
  );
};

export default Camera;
