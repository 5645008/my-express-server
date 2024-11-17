// TextScanPage.js
import React  from 'react';
import Camera  from './Camera';
import TextScanner  from './TextScanner';
import ImagePreview  from './ImagePreview';
import useCamera  from './useCamera';



function TextScanPage() {
  const { image, captureImage } = useCamera();
  console.log({ image, captureImage });

  return (
    <div className="TextScanPage">
      <h1>Text Scanner App</h1>
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