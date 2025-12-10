import React, { useState, useEffect } from 'react';
import PageConfig from 'components/common/PageConfig';

const CameraMock = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  const simulateCapture = () => {
    setIsCapturing(true);
    // Simulate camera shutter sound or animation
    console.log('Simulating photo capture...');

    setTimeout(() => {
      const mockPhotoPath = 'mock_path/simulated_photo_' + Date.now() + '.jpg';
      const mockBase64 = 'data:image/jpeg;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // A tiny transparent GIF
      setPhotoUri(mockPhotoPath);
      setIsCapturing(false);
      
      // Simulate returning data to the Fleetbo Engine
      Fleetbo.back({
        imagePath: mockPhotoPath,
        base64: mockBase64,
        message: 'Photo simulée capturée avec succès.'
      });
    }, 2000); // Simulate 2 seconds for capture and processing
  };

  const handleBack = () => {
    Fleetbo.back();
  };

  return (
    <div style={styles.container}>
      <PageConfig navbar="none" />
      <div style={styles.viewfinder}>
        {isCapturing ? (
          <div style={styles.capturingOverlay}>Capture en cours...</div>
        ) : (
          <div style={styles.previewText}>Prévisualisation de la caméra simulée</div>
        )}
      </div>
      <div style={styles.controls}>
        <button
          onClick={simulateCapture}
          style={styles.captureButton}
          disabled={isCapturing}
        >
          {isCapturing ? '...' : ''}
        </button>
        <button
          onClick={handleBack}
          style={styles.backButton}
          disabled={isCapturing}
        >
          Retour
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    color: '#fff',
  },
  viewfinder: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    fontSize: '1.2em',
    position: 'relative',
  },
  previewText: {
    color: '#aaa',
  },
  capturingOverlay: {
    color: '#fff',
    fontSize: '1.5em',
    fontWeight: 'bold',
    animation: 'flash 0.5s infinite alternate',
  },
  controls: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  captureButton: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'red',
    border: '5px solid #fff',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5em',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0 0 15px rgba(255,0,0,0.7)',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

// Add a simple keyframe animation for the flash effect
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes flash {
    from { opacity: 1; }
    to { opacity: 0.7; }
  }
`, styleSheet.cssRules.length);

export default CameraMock;
