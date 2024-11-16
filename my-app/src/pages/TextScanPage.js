import React, { useState } from 'react';
import Camera from './Camera';
import ImagePreview from './ImagePreview';
import TextScanner from './TextScanner';

const TextScanPage = () => {
  const [image, setImage] = useState(null);

  const handleCapture = (capturedImage) => {
    setImage(capturedImage); // 이미지 캡처 후 상태 업데이트
  };

  return (
    <div>
      <h1>Text Scanner</h1>
      {/* Camera 컴포넌트: 이미지 캡처 기능 */}
      <Camera onCapture={handleCapture} />
      
      {/* ImagePreview 컴포넌트: 캡처된 이미지 미리보기 */}
      <ImagePreview image={image} />

      {/* TextScanner 컴포넌트: 이미지에서 텍스트 추출 */}
      {image && <TextScanner image={image} />}
    </div>
  );
};

export default TextScanPage;