import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import cv from 'opencv.js';


const ScanQR = () => {
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [qrDataList, setQrDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const qrCodeRegionId = "reader";
  let html5QrCode;

  useEffect(() => {
    html5QrCode = new Html5Qrcode(qrCodeRegionId);

    if (isScanning && !html5QrCode.isScanning) {
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            qrCodeMessage => {
                console.log(`QR Code detected: ${qrCodeMessage}`);
                setScannedData(qrCodeMessage);
                setQrDataList(prevList => [...prevList, qrCodeMessage]);
                setIsScanning(false);
                setErrorMessage(null);
                html5QrCode.stop();
            },
            error => {
                setErrorMessage(`QR Code scanning error: ${error}`);
                console.warn(error);
            }
        ).catch(err => {
            setErrorMessage(`Unable to start scanning, error: ${err}`);
        });
    }

    return () => {
        if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                console.log("QR Code scanning stopped.");
            }).catch(err => {
                console.error(`Unable to stop scanning, error: ${err}`);
            });
        }
    };
}, [isScanning]);


  const handleNext = () => {
    setScannedData(null);
    setIsScanning(true);
  };

  const handleTextScan = (image) => {
    Tesseract.recognize(
      image,
      'kor+eng',
      {
        logger: info => console.log(info) // Tùy chọn để xem tiến trình
      }
    ).then(({ data: { text } }) => {
      console.log(`Recognized text: ${text}`);
      setScannedData(text);
      setQrDataList(prevList => [...prevList, text]);
    });
  };

  const captureTextFromCamera = () => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        video.play();
  
        video.onloadedmetadata = () => {
          // Đặt kích thước canvas theo video
          canvas.width = video.videoWidth * 2;
          canvas.height = video.videoHeight * 2;
        };
  
        // Chụp hình sau một khoảng thời gian
        setTimeout(() => {
          context.drawImage(video, 0, 0, canvas.width, canvas.height); // Chụp ảnh từ video stream
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height); // Lấy dữ liệu hình ảnh từ canvas
  
          // Chuyển đổi dữ liệu hình ảnh sang đối tượng Mat của OpenCV
          let src = cv.matFromImageData(imageData);
          let gray = new cv.Mat();
          let dst = new cv.Mat();
  
          // Chuyển đổi sang ảnh xám
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  
          // Thực hiện xử lý hình ảnh khác nếu cần (như lọc, làm sắc nét, v.v.)
          cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
          cv.threshold(gray, dst, 150, 255, cv.THRESH_BINARY);
  
          // Chuyển đổi lại Mat thành base64
          const processedImageData = new ImageData(dst.data, dst.cols, dst.rows);
          context.putImageData(processedImageData, 0, 0);
          const processedImageUrl = canvas.toDataURL('image/png');
  
          // Quét văn bản từ ảnh đã xử lý
          Tesseract.recognize(
            processedImageUrl,  // Sử dụng base64 URL của ảnh đã xử lý
            'kor+eng',          // Nhận diện cả tiếng Hàn và tiếng Anh
            {
              logger: info => console.log(info) // Theo dõi tiến trình nhận diện
            }
          ).then(({ data: { text } }) => {
            if (text) {
              setScannedData(text);  // Lưu văn bản nhận diện được
              setQrDataList(prevList => [...prevList, text]);  // Thêm vào danh sách quét
            } else {
              setErrorMessage('Không tìm thấy văn bản trong hình ảnh.');
            }
  
            // Tắt camera sau khi quét xong
            video.srcObject.getTracks().forEach(track => track.stop());
          }).catch(err => {
            console.error(`Lỗi nhận diện văn bản: ${err}`);
            setErrorMessage('Lỗi khi nhận diện văn bản, thử lại.');
  
            // Tắt camera khi có lỗi
            video.srcObject.getTracks().forEach(track => track.stop());
          });
        }, 3000); // Chụp ảnh sau 3 giây
  
      }).catch(err => {
        console.error(`Camera access error: ${err.message}`);
        setErrorMessage('Không thể truy cập camera, vui lòng cấp quyền.');
      });
  };
  
  
  
  

  useEffect(() => {
    setFilteredData(
      qrDataList.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, qrDataList]);

  return (
    <div>
      <h2>QR Code Scanner & Text Scanner</h2>

      <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "350px", height: "250px", margin: "0 auto", position: "relative", zIndex: 1 }}></div>

      {scannedData ? (
        <div>
          <p>Scanned Data: {scannedData}</p>
          <button onClick={handleNext}>Next</button>
        </div>
      ) : (
        <p>No data scanned yet. Position the QR code in front of the camera.</p>
      )}

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div style={{ position: "relative", zIndex: 2, marginTop: "20px" }}>
        <input
          type="text"
          placeholder='Search scanned data...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <h3>Search Results</h3>
        {filteredData.length > 0 ? (
          <ul>
            {filteredData.map((data, index) => (
              <li key={index}>{data}</li>
            ))}
          </ul>
        ) : (
          <p>No matching results found.</p>
        )}
      </div>

      <button onClick={captureTextFromCamera}>Scan Text from Camera</button>
    </div>
  );
};

export default ScanQR;
