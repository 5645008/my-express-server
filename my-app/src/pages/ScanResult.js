import React from 'react';
import { Link } from 'react-router-dom';
import Camera from './TextScan/Camera';
import TextScanner from './TextScan/TextScanner';
import ImagePreview from './TextScan/ImagePreview';
import useCamera from './TextScan/useCamera';
import back from '../assets/back_arrow.png';
import cameraIcon from '../assets/camera.png';
import '../css/TextScanPage.styled.css';

function TextScanPage() {
  const { image, captureImage } = useCamera();

  return (
    <div className="TextScanPage">
      <Link to="/main">
        <img src={back} width="20px" alt="뒤로 가기" />
      </Link>
      <h1>
        <img src={cameraIcon} alt="Camera" className="button-icon" />
      </h1>
      <div className="camera-container">
        <Camera onCapture={captureImage} />
      </div>
      {image && (
        <>
          <ImagePreview image={image} />
          <TextScanner image={image} />
        </>
      )}
    </div>
  );
}

export default TextScanPage;