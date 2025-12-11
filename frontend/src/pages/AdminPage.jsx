// frontend/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { sendCommand, listenForCommands } from '../utils/broadcast'; 
import SharedCamera from '../components/SharedCamera'; 

const AdminPage = () => {
  const [logs, setLogs] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userName, setUserName] = useState('');

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${message}`, ...prev]);
  };

  // Listen for signals from TV
  useEffect(() => {
    console.log('🎧 [AdminPage] Setting up broadcast listener...');
    const cleanup = listenForCommands((msg) => {
      console.log('🎧 [AdminPage] Received message:', msg);
      if (msg.type === 'USER_READY') {
        const tvUserName = msg.payload?.userName;
        setUserName(tvUserName || '');
        addLog(`📺 TV User ready: ${tvUserName}`);
        console.log('🎧 [AdminPage] USER_READY processed, userName set to:', tvUserName);
      } else if (msg.type === 'OPEN_CAMERA') {
        console.log('🎧 [AdminPage] OPEN_CAMERA received! Opening camera...');
        addLog('📺 TV requested camera capture');
        setShowCamera(true);
        // Also tell TV to open camera
        sendCommand('OPEN_CAMERA_TV', { userName: msg.payload?.userName || userName });
        addLog('📡 Camera opened on TV screen');
      }
    });
    return cleanup;
  }, []);

  const handleCommand = (route, message) => {
    sendCommand('NAVIGATE', route);
    addLog(message);
  };

  // Handle camera capture on laptop
  const handleCameraCapture = (imageBlob) => {
    addLog('📸 Photo captured on Laptop!');
    setCapturedImage(imageBlob);
    setShowCamera(false);
  };

  // Open camera on both laptop and TV
  const handleOpenCamera = () => {
    addLog('📸 Opening camera on both screens...');
    setShowCamera(true);
    // Tell TV to open camera too
    sendCommand('OPEN_CAMERA_TV', { userName });
    addLog('📡 Camera opened on TV screen');
  };

  // Analyze and send results to TV
  const handleAnalyzeAndSendToTV = async () => {
    if (!capturedImage) {
      alert('❌ No photo captured!');
      return;
    }

    if (!userName.trim()) {
      alert('❌ Please enter your name!');
      return;
    }

    setIsAnalyzing(true);
    addLog('⏳ Analyzing photo...');

    try {
      // Send to backend API for analysis
      const formData = new FormData();
      formData.append('image', capturedImage, 'capture.jpg');
      formData.append('name', userName);

      const response = await fetch('http://localhost:8000/api/analyze?recommend=true', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Analysis failed');
      }

      const analysisResults = await response.json();
      addLog('✅ Analysis complete!');

      // Save to sessionStorage for TV to access
      const dataToSave = {
        userName,
        results: analysisResults  // ← Only analysis results, NO photo
      };
      
      sessionStorage.setItem('analysisResults', JSON.stringify(dataToSave));
      addLog('📡 Saved results to sessionStorage');
      console.log('📡 SessionStorage data:', dataToSave);

      // Send analysis data via broadcast to TV (UPDATE_DATA message)
      sendCommand('UPDATE_DATA', {
        name: userName,
        results: analysisResults
      });
      addLog('📡 Analysis data sent via broadcast');
      console.log('📡 UPDATE_DATA sent with results');

      // Also send navigation command to show results page
      setTimeout(() => {
        sendCommand('NAVIGATE', '/results');
        addLog('📺 TV navigating to results page');
        console.log('📡 NAVIGATE /results sent');
      }, 500);

      // Reset for next capture
      setCapturedImage(null);
      setUserName('');
    } catch (err) {
      addLog('❌ Error: ' + err.message);
      alert('Analysis failed: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Background Decorative Images */}
      <div style={styles.bgImageContainer}>
        <img 
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop" 
          alt="decoration" 
          style={{...styles.bgImage, top: '5%', left: '3%'}}
        />
        <img 
          src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop" 
          alt="decoration" 
          style={{...styles.bgImage, top: '15%', right: '5%'}}
        />
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop" 
          alt="decoration" 
          style={{...styles.bgImage, bottom: '10%', left: '8%'}}
        />
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop" 
          alt="decoration" 
          style={{...styles.bgImage, bottom: '20%', right: '3%'}}
        />
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <div style={styles.cameraOverlay}>
          <div style={styles.cameraBox}>
            <h3 style={styles.cameraTitle}>
              👁️ ANALYST VIEW: LIVE MESH
            </h3>
            <SharedCamera onCapture={handleCameraCapture} />
            <button style={styles.closeBtn} onClick={() => setShowCamera(false)}>
              ❌ ABORT SCAN
            </button>
          </div>
        </div>
      )}

      {/* LEFT PANEL - CONTROLS */}
      <div style={styles.panel}>
        <div style={styles.headerSection}>
          <div style={styles.iconBadge}>🌸</div>
          <h2 style={styles.mainTitle}>Pink Aura Admin</h2>
          <p style={styles.subtitle}>Capture & Control Dashboard</p>
        </div>
        
        {/* Connection Status */}
        <div style={styles.statusCard}>
          <div style={styles.statusIndicator}>
            <div style={styles.pulseCircle}></div>
            <span style={styles.statusText}>BroadcastChannel Active</span>
          </div>
          <div style={styles.userInfo}>
            {userName ? (
              <>
                <span style={styles.userLabel}>Connected User:</span>
                <span style={styles.userName}>{userName}</span>
              </>
            ) : (
              <span style={styles.waitingText}>Waiting for TV user...</span>
            )}
          </div>
        </div>
        
        {/* Capture Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📸</span>
            <h4 style={styles.sectionTitle}>Capture Photo</h4>
          </div>
          
          <label style={styles.label}>Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={styles.input}
          />
          
          {!capturedImage ? (
            <button 
              style={{...styles.btn, ...styles.btnPrimary}} 
              onClick={handleOpenCamera}
            >
              <span style={styles.btnIcon}>📷</span>
              Open Camera
            </button>
          ) : (
            <>
              <div style={styles.photoPreview}>
                <div style={styles.checkmark}>✓</div>
                <p style={styles.capturedText}>Photo Captured Successfully</p>
              </div>
              <button 
                style={{...styles.btn, ...styles.btnSuccess}}
                onClick={handleAnalyzeAndSendToTV}
                disabled={isAnalyzing}
              >
                <span style={styles.btnIcon}>{isAnalyzing ? '⏳' : '✨'}</span>
                {isAnalyzing ? 'Analyzing...' : 'Analyze & Send to TV'}
              </button>
              <button 
                style={{...styles.btn, ...styles.btnSecondary}}
                onClick={() => { setCapturedImage(null); setShowCamera(true); }}
              >
                <span style={styles.btnIcon}>🔄</span>
                Retake Photo
              </button>
            </>
          )}
        </div>

        {/* Navigation Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🎬</span>
            <h4 style={styles.sectionTitle}>TV Navigation</h4>
          </div>
          
          <button style={{...styles.btn, ...styles.btnNav}} onClick={() => handleCommand('/', 'Reset to Welcome')}>
            <span style={styles.btnIcon}>🏠</span>
            Home
          </button>
          
          <button style={{...styles.btn, ...styles.btnNav}} onClick={() => handleCommand('/results', 'Show Results')}>
            <span style={styles.btnIcon}>🔍</span>
            Show Results
          </button>
          
          <button style={{...styles.btn, ...styles.btnNav}} onClick={() => handleCommand('/lip-colors', 'Show Lipstick Colors')}>
            <span style={styles.btnIcon}>💄</span>
            Lipstick Colors
          </button>
          
          <button style={{...styles.btn, ...styles.btnNav}} onClick={() => handleCommand('/results/dress', 'Show Dress Colors')}>
            <span style={styles.btnIcon}>👗</span>
            Dress Colors
          </button>
          
          <button style={{...styles.btn, ...styles.btnNav}} onClick={() => handleCommand('/results/tryon', 'Virtual Try-On')}>
            <span style={styles.btnIcon}>✨</span>
            Virtual Try-On
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - LOGS */}
      <div style={styles.logPanel}>
        <div style={styles.logHeader}>
          <span style={styles.terminalIcon}>📟</span>
          <h3 style={styles.logTitle}>Admin Terminal</h3>
        </div>
        <div style={styles.logBox}>
          {logs.length === 0 && <span style={styles.emptyLog}>Waiting for actions...</span>}
          {logs.map((log, i) => (
            <div key={i} style={styles.logEntry}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '24px',
    gap: '24px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  },
  bgImage: {
    position: 'absolute',
    width: '200px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '16px',
    opacity: 0.08,
    filter: 'blur(2px)',
    transform: 'rotate(-5deg)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  panel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '32px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    position: 'relative',
    zIndex: 1
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid rgba(255, 20, 147, 0.2)'
  },
  iconBadge: {
    fontSize: '48px',
    marginBottom: '12px',
    display: 'inline-block',
    animation: 'float 3s ease-in-out infinite'
  },
  mainTitle: {
    background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  statusCard: {
    padding: '20px',
    backgroundColor: 'rgba(0, 170, 0, 0.05)',
    borderRadius: '16px',
    marginBottom: '24px',
    border: '2px solid rgba(0, 170, 0, 0.2)',
    transition: 'all 0.3s ease'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  pulseCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#00AA00',
    animation: 'pulse 2s ease-in-out infinite',
    boxShadow: '0 0 20px rgba(0, 170, 0, 0.5)'
  },
  statusText: {
    color: '#00AA00',
    fontSize: '14px',
    fontWeight: '600'
  },
  userInfo: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userLabel: {
    color: '#666',
    fontSize: '12px',
    fontWeight: '500'
  },
  userName: {
    color: '#333',
    fontSize: '13px',
    fontWeight: '700',
    backgroundColor: 'rgba(0, 170, 0, 0.1)',
    padding: '4px 12px',
    borderRadius: '8px'
  },
  waitingText: {
    color: '#999',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  section: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(0,0,0,0.08)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  sectionIcon: {
    fontSize: '24px'
  },
  sectionTitle: {
    color: '#333',
    fontSize: '20px',
    fontWeight: '700',
    margin: 0
  },
  label: {
    display: 'block',
    color: '#555',
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: '600',
    letterSpacing: '0.3px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '16px',
    backgroundColor: '#F8F9FA',
    color: '#333',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    fontSize: '15px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    outline: 'none'
  },
  logPanel: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '24px',
    borderRadius: '24px',
    border: '2px solid rgba(0, 255, 0, 0.3)',
    color: '#00ff00',
    fontFamily: "'Courier New', monospace",
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    position: 'relative',
    zIndex: 1
  },
  logHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(0, 255, 0, 0.3)'
  },
  terminalIcon: {
    fontSize: '24px'
  },
  logTitle: {
    color: '#00ff00',
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    textShadow: '0 0 10px rgba(0,255,0,0.5)'
  },
  logBox: {
    overflowY: 'auto',
    flex: 1,
    fontSize: '13px',
    lineHeight: '1.6'
  },
  emptyLog: {
    color: '#555',
    fontStyle: 'italic'
  },
  logEntry: {
    fontFamily: "'Courier New', monospace",
    margin: '6px 0',
    fontSize: '12px',
    padding: '4px 0',
    borderBottom: '1px solid rgba(0, 255, 0, 0.1)'
  },
  btn: {
    width: '100%',
    padding: '14px 20px',
    marginBottom: '12px',
    fontSize: '15px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '12px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    outline: 'none'
  },
  btnIcon: {
    fontSize: '18px'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)',
    color: 'white',
    justifyContent: 'center'
  },
  btnSuccess: {
    background: 'linear-gradient(135deg, #00AA00 0%, #00DD00 100%)',
    color: 'white',
    justifyContent: 'center'
  },
  btnSecondary: {
    backgroundColor: '#6C757D',
    color: 'white',
    justifyContent: 'center'
  },
  btnNav: {
    backgroundColor: '#F8F9FA',
    color: '#333',
    border: '2px solid #E0E0E0'
  },
  photoPreview: {
    padding: '20px',
    backgroundColor: 'rgba(0, 170, 0, 0.05)',
    border: '2px solid rgba(0, 170, 0, 0.3)',
    borderRadius: '16px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  checkmark: {
    display: 'inline-block',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#00AA00',
    color: 'white',
    fontSize: '32px',
    lineHeight: '48px',
    marginBottom: '8px',
    animation: 'scaleIn 0.3s ease'
  },
  capturedText: {
    color: '#00AA00',
    fontSize: '14px',
    margin: '0',
    fontWeight: '600'
  },
  cameraOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(20px)'
  },
  cameraBox: {
    backgroundColor: 'rgba(45, 45, 45, 0.95)',
    padding: '32px',
    borderRadius: '24px',
    border: '3px solid #FF1493',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 30px 90px rgba(255,20,147,0.4)'
  },
  cameraTitle: {
    color: '#00ff00',
    fontFamily: 'monospace',
    marginBottom: '20px',
    fontSize: '18px',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(0,255,0,0.5)'
  },
  closeBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '14px',
    backgroundColor: '#AA0000',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(170,0,0,0.3)'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  input:focus {
    border-color: #FF1493 !important;
    box-shadow: 0 0 0 3px rgba(255,20,147,0.1) !important;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
  }
  
  button:active {
    transform: translateY(0px);
  }
`;
document.head.appendChild(styleSheet);

export default AdminPage;