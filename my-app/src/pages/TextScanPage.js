import React, { useState } from 'react';
import Camera from './Camera';
import ImagePreview from './ImagePreview';
import TextScanner from './TextScanner';

const TextScanPage = () => {
  const [image, setImage] = useState(null);

  const handleCapture = (capturedImage) => {
    setImage(capturedImage);
  };

  return (
    <div>
      <h1>Text Scanner</h1>
      {/* Camera Component */}
      <Camera onCapture={handleCapture} />
      {/* Image Preview Component */}
      <ImagePreview image={image} />
      {/* Text Scanner Component */}
      {image && <TextScanner image={image} />}
    </div>
  );
};

export default TextScanPage;