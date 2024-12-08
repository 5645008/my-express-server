// TextScanPage.js
import React  from 'react';
import { Link } from 'react-router-dom';
import Camera  from './TextScan/Camera';
import TextScanner  from './TextScan/TextScanner';
import ImagePreview  from './TextScan/ImagePreview';
import useCamera  from './TextScan/useCamera';
import back from '../assets/back_arrow.png';
import camera from '../assets/camera.png';
import '../css/TextScanPage.styled.css';

function TextScanPage() {
  const { image, captureImage } = useCamera();
  console.log({ image, captureImage });

  return (
    <div className="TextScanPage">
      <Link to="/main"><img src={back} width="20px" alt="back" /></Link>
      <h1><img src={camera} alt="Camera" className="button-icon" /></h1>
      <Camera onCapture={captureImage} />
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