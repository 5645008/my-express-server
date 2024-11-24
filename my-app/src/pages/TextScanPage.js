// TextScanPage.js
import React  from 'react';
import Camera  from './Textscan/Camera';
import TextScanner  from './TextScan/TextScanner';
import ImagePreview  from './TextScan/ImagePreview';
import useCamera  from './TextScan/useCamera';



function TextScanPage() {
  const { image, captureImage } = useCamera();
  console.log({ image, captureImage });

  return (
    <div className="TextScanPage">
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