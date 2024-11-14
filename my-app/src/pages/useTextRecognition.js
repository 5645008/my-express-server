// hooks/useTextRecognition.js
import { useState } from 'react';
import axios from 'axios';
import { GOOGLE_CLOUD_VISION_API_KEY } from '../config/config';

const useTextRecognition = () => {
  const [text, setText] = useState('');

  const scanText = async (image) => {
    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          requests: [
            {
              image: {
                content: image.split('data:image/jpeg;base64,')[1],
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }
      );
      setText(response.data.responses[0].fullTextAnnotation.text);
    } catch (error) {
      console.error('Error scanning text:', error);
    }
  };

  return { text, scanText };
};

export default useTextRecognition;
