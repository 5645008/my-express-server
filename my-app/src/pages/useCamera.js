import { useState, useEffect } from 'react';

const useCamera = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);

        // 연결된 비디오 태그 가져오기
        const video = document.querySelector('video');
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } catch (error) {
        console.error('Camera access error:', error);
      }
    };
    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    const video = document.querySelector('video');
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    setImage(imgData);
    console.log('Captured Image:', imgData);
  };

  return { image, captureImage };
};

export default useCamera;