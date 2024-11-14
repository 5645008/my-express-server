import { useState, useEffect } from 'react';

const useCamera = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
      } catch (error) {
        console.error('Camera access error:', error);
      }
    };
    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const captureImage = () => {
    const video = document.querySelector('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setImage(canvas.toDataURL('image/png'));
    
    // ��?m b?o khai bao bi?n imgData ��ung cach
    const imgData = canvas.toDataURL('image/png'); 
  
    console.log('Captured Image:', imgData); 
  
    setImage(imgData); 
  };

  return { cameraStream, image, captureImage };
};

export default useCamera;