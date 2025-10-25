// src/components/OBSLeaderboard.js
import React, { useState, useEffect } from 'react';
import { formatTimeForDisplay } from '../utils/timeFormat';

const OBSLeaderboard = ({ fontFamily = 'Verdana, sans-serif', textColor = '#ffffff' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/runners/leaderboard_data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      setLeaderboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    
    // Update every second
    const interval = setInterval(fetchLeaderboardData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply custom font and full background to the component
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
    left: 0
  };

  const positionStyle = {
    fontFamily: fontFamily,
    color: textColor
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="leaderboard loading" style={{...positionStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="leaderboard error" style={{...positionStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="leaderboard">
        {leaderboardData.length === 0 ? (
          <div className="position" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <div className="placement-name" style={positionStyle}>No runners with names entered</div>
          </div>
        ) : (
          leaderboardData.map((runner, index) => {
            const formattedTime = formatTimeForDisplay(runner.time);
            const displayName = runner.name;
            
            return (
              <div key={index} className="position" style={positionStyle}>
                <div className="placement-name" style={positionStyle}>
                  {index + 1}. {displayName}
                </div>
                <div className={`perf-time ${!runner.validTime ? 'no-time' : ''}`} style={positionStyle}>
                  {formattedTime || 'No Time'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OBSLeaderboard;