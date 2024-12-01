// TextScanPage.js
import React  from 'react';
import Camera  from './TextScan/Camera';
import TextScanner  from './TextScan/TextScanner';
import ImagePreview  from './TextScan/ImagePreview';
import useCamera  from './TextScan/useCamera';
import back from '../assets/back_arrow.png';



function TextScanPage() {
  const { image, captureImage } = useCamera();
  console.log({ image, captureImage });

  return (
    <div className="TextScanPage">
      <Link to="/main"><img src={back} width="20px" alt="back" /></Link>
      <h1>Text Scanner</h1>
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