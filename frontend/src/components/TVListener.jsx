// frontend/src/components/TVListener.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenForCommands } from '../utils/broadcast';

const TVListener = ({ setAnalysisResults, setCapturedImage, setUserName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    listenForCommands((msg) => {
      console.log("📺 TV Received:", msg);

      // 1. Handle Navigation
      if (msg.type === 'NAVIGATE') {
        navigate(msg.payload);
      }

      // 2. Handle Data Updates (The "Magic" part)
      if (msg.type === 'UPDATE_DATA') {
        const { results, image, name } = msg.payload;
        
        // Save to sessionStorage immediately so SkinAnalysis page can read it
        if (results && name) {
          const dataToSave = {
            userName: name,
            results: results,
            capturedImageUrl: image ? 'stored' : null
          };
          sessionStorage.setItem('analysisResults', JSON.stringify(dataToSave));
          console.log('📺 [TVListener] ✅ Saved analysis data to sessionStorage:', dataToSave);
        }
        
        // Also update component state
        if (results) setAnalysisResults(results);
        if (image) setCapturedImage(image);
        if (name) setUserName(name);
      }
    });
  }, [navigate, setAnalysisResults, setCapturedImage, setUserName]);

  return null;
};

export default TVListener;