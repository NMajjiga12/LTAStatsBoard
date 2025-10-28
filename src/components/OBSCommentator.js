import React, { useState, useEffect } from 'react';

const OBSCommentator = ({ commentatorNumber, fontFamily = 'Verdana, sans-serif', textColor = '#ffffff' }) => {
  const [commentatorData, setCommentatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchCommentatorData = async () => {
    try {
      console.log(`Fetching commentator data for commentator ${commentatorNumber}...`);
      const response = await fetch('/api/commentators');
      if (!response.ok) {
        throw new Error('Failed to fetch commentator data');
      }
      const commentators = await response.json();
      
      // Get the specific commentator by slot number (commentatorNumber is 1-based)
      const commentatorIndex = parseInt(commentatorNumber) - 1;
      if (commentatorIndex >= 0 && commentatorIndex < commentators.length) {
        const commentator = commentators[commentatorIndex];
        if (commentator.enabled && commentator.name && commentator.handle) {
          console.log(`Found enabled commentator:`, commentator);
          setCommentatorData(commentator);
          setError(null);
        } else {
          setError(`Commentator ${commentatorNumber} not fully configured`);
          setCommentatorData(null);
        }
      } else {
        setError(`Commentator ${commentatorNumber} not found`);
        setCommentatorData(null);
      }
    } catch (err) {
      console.error('Error fetching commentator data:', err);
      setError(err.message);
      setCommentatorData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentatorData();
    
    // Update every 2 seconds to get latest data
    const interval = setInterval(fetchCommentatorData, 2000);
    
    return () => clearInterval(interval);
  }, [commentatorNumber, lastUpdate]);

  // Generate the reactive URL from Discord ID
  const getReactiveUrl = () => {
    if (!commentatorData || !commentatorData.discordId) {
      return 'https://reactive.fugi.tech/basic/706610731210113044'; // Default avatar
    }
    return `https://reactive.fugi.tech/basic/${commentatorData.discordId}`;
  };

  const containerStyle = {
    fontFamily: fontFamily,
    fontSize: '16px',
    color: textColor,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const profileContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderRadius: '12px',
    padding: '15px 25px',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.1)',
  };

  const iframeStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: 'none',
    overflow: 'hidden',
    backgroundColor: '#000'
  };

  const textSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const nameStyle = {
    fontSize: '3.6rem',
    fontWeight: 'bold',
    color: textColor,
    fontFamily: fontFamily
  };

  const handleStyle = {
    fontSize: '2.5rem',
    color: '#aaa',
    fontFamily: fontFamily
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={profileContainerStyle}>
          <div style={textSectionStyle}>
            <div style={nameStyle}>Loading Commentator {commentatorNumber}...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={profileContainerStyle}>
          <div style={textSectionStyle}>
            <div style={nameStyle}>Commentator {commentatorNumber}</div>
            <div style={handleStyle}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!commentatorData) {
    return (
      <div style={containerStyle}>
        <div style={profileContainerStyle}>
          <div style={textSectionStyle}>
            <div style={nameStyle}>Commentator {commentatorNumber}</div>
            <div style={handleStyle}>Not configured</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={profileContainerStyle}>
        <iframe 
          src={getReactiveUrl()} 
          title="Commentator's Reactive Avatar"
          allowtransparency="true"
          style={iframeStyle}
        >
        </iframe>
        <div style={textSectionStyle}>
          <div style={nameStyle}>{commentatorData.name}</div>
          <div style={handleStyle}>@{commentatorData.handle}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OBSCommentator);