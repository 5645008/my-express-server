// ImagePreview.js
import React from 'react';

const ImagePreview = ({ image }) => {
  console.log(image);  // Ki?m tra gia tr? image

  return image ? (
    <img src={image} alt="Captured" style={{ width: '30%' }} />// ��i?u ch?nh kich th??c ?nh ��a ch?p
  ) : (
    <p>No image captured yet</p> // Thong bao n?u ch?a co ?nh
  );
};

export default ImagePreview;
